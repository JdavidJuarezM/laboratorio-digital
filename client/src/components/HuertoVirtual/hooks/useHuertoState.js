// client/src/components/HuertoVirtual/hooks/useHuertoState.js

import { useReducer, useEffect, useCallback, useRef } from "react";
import useSound from "use-sound";
import {
  getEstadoHuerto,
  guardarEstadoHuerto,
} from "../../../services/huertoService";

import { GAME_CONFIG } from "../../../constants/gameConfig";

import { bancoDePreguntas } from "../../../constants/bancoDePreguntas";

const initialState = {
  etapa: 0,
  agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
  sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
  respuestasCorrectas: 0,
  preguntaActual: null,
  preguntasHechas: [],
  pasoTutorial: 1,
  etapaCelebracion: null,
  isSaving: false,
  isLoading: true,
};

function gameReducer(state, action) {
  // ... (tu reducer, que está perfecto, va aquí sin cambios)
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return { ...state, ...action.payload, isLoading: false };
    case "GAME_TICK":
      return {
        ...state,
        agua: Math.max(state.agua - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0),
        sol: Math.max(state.sol - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0),
      };
    case "APPLY_RESOURCE":
      const { resourceId, amount } = action.payload;
      if (resourceId !== "agua" && resourceId !== "sol") return state;
      return {
        ...state,
        [resourceId]: Math.min(
          state[resourceId] + amount,
          GAME_CONFIG.MAX_RESOURCE_LEVEL
        ),
      };
    case "SHOW_QUESTION":
      if (state.preguntaActual || state.respuestasCorrectas >= 3) return state;
      const preguntasDisponibles = (bancoDePreguntas[state.etapa] || []).filter(
        (p) => !state.preguntasHechas.includes(p.pregunta)
      );
      if (preguntasDisponibles.length > 0) {
        const pregunta =
          preguntasDisponibles[
            Math.floor(Math.random() * preguntasDisponibles.length)
          ];
        return {
          ...state,
          preguntaActual: pregunta,
          preguntasHechas: [...state.preguntasHechas, pregunta.pregunta],
        };
      }
      return state;
    case "ANSWER_QUESTION":
      return {
        ...state,
        preguntaActual: null,
        respuestasCorrectas:
          state.respuestasCorrectas + (action.payload.esCorrecta ? 1 : 0),
      };
    case "ADVANCE_STAGE":
      const nuevaEtapa = state.etapa + 1;
      return {
        ...initialState,
        etapa: nuevaEtapa,
        isLoading: false,
        pasoTutorial: 0,
        etapaCelebracion: nuevaEtapa,
      };
    case "HIDE_CELEBRATION":
      return { ...state, etapaCelebracion: null };
    case "RESTART":
      return { ...initialState, isLoading: false, pasoTutorial: 0 };
    case "SET_TUTORIAL_STEP":
      return { ...state, pasoTutorial: action.payload };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

export const useHuertoState = () => {
  const [estado, dispatch] = useReducer(gameReducer, initialState);
  const [playCrecimiento] = useSound("/sonido-crecimiento.mp3", {
    volume: 0.5,
  });
  const shakeDataRef = useRef({
    agua: { count: 0, lastTime: 0, lastDir: null },
    sol: { count: 0, lastTime: 0, lastDir: null },
  });

  // --- EFECTOS SECUNDARIOS ---

  // Cargar estado inicial
  useEffect(() => {
    getEstadoHuerto().then((data) => {
      if (data) dispatch({ type: "SET_INITIAL_STATE", payload: data });
      else dispatch({ type: "SET_INITIAL_STATE", payload: {} });
    });
  }, []);

  // Guardar estado cuando cambie (SOLUCIÓN AL STALE STATE)
  useEffect(() => {
    if (!estado.isLoading) {
      // No guardar durante la carga inicial
      const handler = setTimeout(() => {
        dispatch({ type: "SET_SAVING", payload: true });
        const { etapa, agua, sol, respuestasCorrectas } = estado;
        guardarEstadoHuerto({ etapa, agua, sol, respuestasCorrectas }).finally(
          () => {
            setTimeout(
              () => dispatch({ type: "SET_SAVING", payload: false }),
              GAME_CONFIG.SAVING_INDICATOR_DELAY_MS
            );
          }
        );
      }, 1000); // Debounce: Espera 1 segundo de inactividad para guardar
      return () => clearTimeout(handler);
    }
  }, [estado.etapa, estado.agua, estado.sol, estado.respuestasCorrectas]);

  // Game Tick
  useEffect(() => {
    const intervalo = setInterval(
      () => dispatch({ type: "GAME_TICK" }),
      GAME_CONFIG.GAME_TICK_INTERVAL_MS
    );
    return () => clearInterval(intervalo);
  }, []);

  // Lógica de juego: avance de etapa y mostrar preguntas
  useEffect(() => {
    const { etapa, agua, sol, respuestasCorrectas, preguntaActual } = estado;
    // Avance de etapa
    const enRango = (n) =>
      n > GAME_CONFIG.GROWTH_THRESHOLD.MIN &&
      n < GAME_CONFIG.GROWTH_THRESHOLD.MAX;
    if (
      etapa < GAME_CONFIG.MAX_PLANT_STAGE &&
      enRango(agua) &&
      enRango(sol) &&
      respuestasCorrectas >= 3
    ) {
      dispatch({ type: "ADVANCE_STAGE" });
      playCrecimiento();
      setTimeout(() => dispatch({ type: "HIDE_CELEBRATION" }), 4000);
    }
    // Mostrar pregunta cuando un recurso llega al máximo
    if (!preguntaActual && (agua >= 100 || sol >= 100)) {
      dispatch({ type: "SHOW_QUESTION" });
    }
  }, [
    estado.agua,
    estado.sol,
    estado.respuestasCorrectas,
    estado.etapa,
    playCrecimiento,
  ]);

  // --- ACCIONES (Ahora más simples, solo despachan) ---
  const acciones = {
    soltarHerramienta: useCallback((resourceId) => {
      dispatch({
        type: "APPLY_RESOURCE",
        payload: { resourceId, amount: GAME_CONFIG.RESOURCE_INCREASE_ON_DROP },
      });
    }, []),

    agitarHerramienta: useCallback((resourceId, delta, over) => {
      const datos = shakeDataRef.current[resourceId];
      const now = Date.now();
      const { TIME_MS, DISTANCE_PX, COUNT } = GAME_CONFIG.SHAKE_DETECTION;
      const currentDir =
        delta.x > 0 ? "derecha" : delta.x < 0 ? "izquierda" : null;
      const cambiado =
        currentDir && datos.lastDir && currentDir !== datos.lastDir;
      const rapido = now - datos.lastTime < TIME_MS;
      const suficiente = Math.abs(delta.x) > DISTANCE_PX;
      if (cambiado && rapido && suficiente) {
        datos.count++;
        if (datos.count >= COUNT) {
          dispatch({
            type: "APPLY_RESOURCE",
            payload: {
              resourceId,
              amount: GAME_CONFIG.RESOURCE_INCREASE_ON_SHAKE,
            },
          });
          datos.count = 0;
        }
      }
      datos.lastTime = now;
      datos.lastDir = currentDir;
    }, []),

    handleRespuesta: useCallback((esCorrecta) => {
      dispatch({ type: "ANSWER_QUESTION", payload: { esCorrecta } });
    }, []),

    reiniciarHuerto: useCallback(() => {
      dispatch({ type: "RESTART" });
    }, []),

    setPasoTutorial: useCallback((paso) => {
      dispatch({ type: "SET_TUTORIAL_STEP", payload: paso });
    }, []),
  };

  return { estado, acciones };
};
