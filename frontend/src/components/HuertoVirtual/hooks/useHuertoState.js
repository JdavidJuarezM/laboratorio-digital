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
  pasoTutorial: 0,
  etapaCelebracion: null,
  isSaving: false,
  isLoading: true,
  error: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return { ...state, ...action.payload, isLoading: false, error: null };
    case "SET_LOADING_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "GAME_TICK":
      return {
        ...state,
        agua: Math.max(state.agua - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0),
        sol: Math.max(state.sol - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0),
      };
    case "APPLY_RESOURCE": {
      const { resourceId, amount } = action.payload;
      if (resourceId !== "agua" && resourceId !== "sol") return state;
      return {
        ...state,
        [resourceId]: Math.min(
          state[resourceId] + amount,
          GAME_CONFIG.MAX_RESOURCE_LEVEL
        ),
      };
    }
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
        ...state,
        etapa: nuevaEtapa,
        agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
        sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
        respuestasCorrectas: 0,
        preguntasHechas: [],
        preguntaActual: null,
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

export const useHuertoState = (juegoIniciado) => {
  const [estado, dispatch] = useReducer(gameReducer, initialState);
  const [playCrecimiento] = useSound("/sonido-crecimiento.mp3", { volume: 0.5 });

  // Corrección: Inicializar shakeDataRef correctamente
  const shakeDataRef = useRef({ history: [], lastApplied: 0 });
  const isCurrentlySaving = useRef(false);

  useEffect(() => {
    if (juegoIniciado) {
      console.log("Huerto: Juego iniciado, cargando estado...");
      getEstadoHuerto()
        .then((data) => {
          if (data) {
            console.log("Huerto: Estado cargado:", data);
            dispatch({ type: "SET_INITIAL_STATE", payload: data });
          } else {
            console.warn("Huerto: No se encontró estado guardado, usando inicial.");
            dispatch({ type: "SET_INITIAL_STATE", payload: {} });
          }
        })
        .catch((err) => {
          console.error("Huerto: Error al cargar estado:", err);
          dispatch({
            type: "SET_LOADING_ERROR",
            payload: "No se pudo cargar el progreso.",
          });
        });
    } else {
      dispatch({
        type: "SET_INITIAL_STATE",
        payload: { ...initialState, isLoading: false },
      });
    }
  }, [juegoIniciado]);

  useEffect(() => {
    if (estado.isLoading || !juegoIniciado || isCurrentlySaving.current) {
      return;
    }

    const handler = setTimeout(async () => {
      isCurrentlySaving.current = true;
      dispatch({ type: "SET_SAVING", payload: true });
      const { etapa, agua, sol, respuestasCorrectas } = estado;
      console.log("Huerto: Guardando estado:", {
        etapa,
        agua,
        sol,
        respuestasCorrectas,
      });

      try {
        await guardarEstadoHuerto({ etapa, agua, sol, respuestasCorrectas });
        console.log("Huerto: Estado guardado exitosamente.");
      } catch (error) {
        console.error("Huerto: Error al guardar estado:", error);
      } finally {
        setTimeout(() => {
          dispatch({ type: "SET_SAVING", payload: false });
          isCurrentlySaving.current = false;
        }, GAME_CONFIG.SAVING_INDICATOR_DELAY_MS);
      }
    }, 1500); // 1.5 segundos de inactividad antes de guardar

    return () => clearTimeout(handler);
  }, [
    estado.etapa,
    estado.agua,
    estado.sol,
    estado.respuestasCorrectas,
    juegoIniciado,
    estado.isLoading,
  ]);

  useEffect(() => {
    if (juegoIniciado && !estado.isLoading) {
      const intervalo = setInterval(
        () => dispatch({ type: "GAME_TICK" }),
        GAME_CONFIG.GAME_TICK_INTERVAL_MS
      );
      return () => clearInterval(intervalo);
    }
  }, [juegoIniciado, estado.isLoading]);

  useEffect(() => {
    if (juegoIniciado && !estado.isLoading) {
      const { etapa, agua, sol, respuestasCorrectas, preguntaActual } = estado;
      const enRango = (n) =>
        n >= GAME_CONFIG.GROWTH_THRESHOLD.MIN &&
        n <= GAME_CONFIG.GROWTH_THRESHOLD.MAX;
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
      if (
        !preguntaActual &&
        !estado.etapaCelebracion &&
        (agua >= 100 || sol >= 100)
      ) {
        dispatch({ type: "SHOW_QUESTION" });
      }
    }
  }, [
    estado.agua,
    estado.sol,
    estado.respuestasCorrectas,
    estado.etapa,
    estado.preguntaActual,
    estado.etapaCelebracion,
    estado.isLoading,
    playCrecimiento,
    juegoIniciado,
  ]);

  const acciones = {
    // Corrección: Lógica de 'soltar' implementada para usar el valor de gameConfig
    soltarHerramienta: useCallback((resourceId) => {
      if (resourceId !== "agua" && resourceId !== "sol") return;
      dispatch({
        type: "APPLY_RESOURCE",
        payload: {
          resourceId,
          amount: GAME_CONFIG.RESOURCE_INCREASE_ON_DROP,
        },
      });
      // Limpiar el historial de shake al soltar
      shakeDataRef.current.history = [];
    }, []),

    // Corrección: Lógica de 'agitar' (shake) implementada
    agitarHerramienta: useCallback((resourceId, delta) => {
      if (resourceId !== "agua" && resourceId !== "sol") return;

      const now = Date.now();
      const shakeConfig = GAME_CONFIG.SHAKE_DETECTION;
      const shakeHistory = shakeDataRef.current.history;

      // 1. Limpiar historial viejo
      while (
        shakeHistory.length > 0 &&
        shakeHistory[0].timestamp < now - shakeConfig.TIME_MS
      ) {
        shakeHistory.shift();
      }

      // 2. Añadir nuevo movimiento
      const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      if (distance > shakeConfig.DISTANCE_PX) {
        shakeHistory.push({ timestamp: now, distance });
      }

      // 3. Comprobar si es un "shake" y si ha pasado el cooldown
      if (
        shakeHistory.length >= shakeConfig.COUNT &&
        now - shakeDataRef.current.lastApplied > shakeConfig.TIME_MS
      ) {
        // ¡Shake detectado!
        shakeDataRef.current.lastApplied = now;
        shakeDataRef.current.history = []; // Limpiar historial después de aplicar

        dispatch({
          type: "APPLY_RESOURCE",
          payload: {
            resourceId,
            amount: GAME_CONFIG.RESOURCE_INCREASE_ON_SHAKE,
          },
        });
      }
    }, []),


    handleRespuesta: useCallback((esCorrecta) => {
      dispatch({ type: "ANSWER_QUESTION", payload: { esCorrecta } });
    }, []),

    reiniciarHuerto: useCallback(() => {
      console.log("Huerto: Reiniciando juego...");
      dispatch({ type: "RESTART" });
    }, []),

    setPasoTutorial: useCallback((paso) => {
      dispatch({ type: "SET_TUTORIAL_STEP", payload: paso });
    }, []),
  };

  return { estado, acciones };
};