// frontend/src/components/HuertoVirtual/hooks/useHuertoState.js

import { useReducer, useEffect, useCallback, useRef } from "react";
import useSound from "use-sound";
// Importamos las funciones ACTUALIZADAS del servicio
import {
  getEstadoHuerto,
  guardarEstadoHuerto,
} from "../../../services/huertoService"; // Asegúrate que la ruta sea correcta

import { GAME_CONFIG } from "../../../constants/gameConfig";
import { bancoDePreguntas } from "../../../constants/bancoDePreguntas";

const initialState = {
  etapa: 0,
  agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
  sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
  respuestasCorrectas: 0,
  preguntaActual: null,
  preguntasHechas: [], // Podríamos querer guardar esto también en el backend
  pasoTutorial: 0, // El tutorial usualmente no se guarda en el backend
  etapaCelebracion: null,
  isSaving: false,
  isLoading: true, // Empezamos como cargando
  error: null, // Para manejar errores de API
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      // Actualiza el estado con los datos cargados, resetea errores y marca como no cargando
      return { ...state, ...action.payload, isLoading: false, error: null };
    case "SET_LOADING_ERROR":
      // Marca un error durante la carga inicial
      return { ...state, isLoading: false, error: action.payload };
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
      // Lógica para elegir pregunta (sin cambios)
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
      // Reseteamos algunos valores al avanzar de etapa
      return {
        ...state, // Mantenemos el estado actual, pero...
        etapa: nuevaEtapa,
        agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL, // Reiniciamos agua
        sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL, // Reiniciamos sol
        respuestasCorrectas: 0, // Reiniciamos contador de respuestas
        preguntasHechas: [], // Limpiamos las preguntas hechas para la nueva etapa
        preguntaActual: null,
        etapaCelebracion: nuevaEtapa, // Mostramos celebración
      };
    case "HIDE_CELEBRATION":
      return { ...state, etapaCelebracion: null };
    case "RESTART":
       // Al reiniciar, establecemos el estado inicial localmente ANTES de guardar
       // para una respuesta visual más rápida. El guardado ocurrirá después.
      return { ...initialState, isLoading: false, pasoTutorial: 0 };
    case "SET_TUTORIAL_STEP":
      return { ...state, pasoTutorial: action.payload };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

// El hook sigue aceptando 'juegoIniciado'
export const useHuertoState = (juegoIniciado) => {
  const [estado, dispatch] = useReducer(gameReducer, initialState);
  const [playCrecimiento] = useSound("/sonido-crecimiento.mp3", { volume: 0.5 });
  const shakeDataRef = useRef(/* ... sin cambios ... */);
  // Ref para evitar guardados múltiples simultáneos
  const isCurrentlySaving = useRef(false);

  // --- EFECTOS SECUNDARIOS ---

  // Cargar estado inicial desde el backend cuando el juego inicia
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
            // Si no hay datos (quizás primera vez), usa el estado inicial pero marca como cargado
            dispatch({ type: "SET_INITIAL_STATE", payload: { /* valores iniciales ya están en initialState */ } });
          }
        })
        .catch((err) => {
           console.error("Huerto: Error al cargar estado:", err);
           dispatch({ type: "SET_LOADING_ERROR", payload: "No se pudo cargar el progreso." });
        });
    } else {
        // Si el juego no está iniciado, resetea al estado inicial (excepto isLoading)
        dispatch({ type: "SET_INITIAL_STATE", payload: { ...initialState, isLoading: false } });
    }
  }, [juegoIniciado]); // Depende solo de juegoIniciado

  // Guardar estado automáticamente cuando cambie (y el juego esté iniciado)
  useEffect(() => {
    // No guardar si está cargando, si el juego no ha iniciado, o si ya estamos guardando
    if (estado.isLoading || !juegoIniciado || isCurrentlySaving.current) {
      return;
    }

    // Usamos un debounce (retraso) para no guardar en cada mínimo cambio
    const handler = setTimeout(async () => {
      isCurrentlySaving.current = true; // Marcamos que estamos guardando
      dispatch({ type: "SET_SAVING", payload: true });
      const { etapa, agua, sol, respuestasCorrectas } = estado;
      console.log("Huerto: Guardando estado:", { etapa, agua, sol, respuestasCorrectas });

      try {
        await guardarEstadoHuerto({ etapa, agua, sol, respuestasCorrectas });
        console.log("Huerto: Estado guardado exitosamente.");
      } catch (error) {
        console.error("Huerto: Error al guardar estado:", error);
        // Podrías mostrar un mensaje de error al usuario aquí si el guardado falla
      } finally {
        // Ocultar indicador después de un breve retraso, incluso si hubo error
        setTimeout(() => {
            dispatch({ type: "SET_SAVING", payload: false });
            isCurrentlySaving.current = false; // Desmarcamos que estamos guardando
        }, GAME_CONFIG.SAVING_INDICATOR_DELAY_MS);
      }
    }, 1500); // Guardamos 1.5 segundos después del último cambio

    // Limpieza: si el estado cambia de nuevo antes de 1.5s, cancela el guardado anterior
    return () => clearTimeout(handler);

  }, [estado.etapa, estado.agua, estado.sol, estado.respuestasCorrectas, juegoIniciado, estado.isLoading]); // Dependencias clave para el guardado

  // Game Tick (sin cambios, ya dependía de juegoIniciado)
  useEffect(() => {
    if (juegoIniciado && !estado.isLoading) { // Añadido chequeo !isLoading
      const intervalo = setInterval(() => dispatch({ type: "GAME_TICK" }), GAME_CONFIG.GAME_TICK_INTERVAL_MS);
      return () => clearInterval(intervalo);
    }
  }, [juegoIniciado, estado.isLoading]);

  // Lógica de avance de etapa y preguntas (sin cambios, ya dependía de juegoIniciado e isLoading)
  useEffect(() => {
    if (juegoIniciado && !estado.isLoading) {
      const { etapa, agua, sol, respuestasCorrectas, preguntaActual } = estado;
      const enRango = (n) => n >= GAME_CONFIG.GROWTH_THRESHOLD.MIN && n <= GAME_CONFIG.GROWTH_THRESHOLD.MAX; // Corregido >= y <=
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
      // Modificación: Solo mostrar pregunta si NO estamos en celebración
      if (!preguntaActual && !estado.etapaCelebracion && (agua >= 100 || sol >= 100)) {
        dispatch({ type: "SHOW_QUESTION" });
      }
    }
  }, [
    estado.agua,
    estado.sol,
    estado.respuestasCorrectas,
    estado.etapa,
    estado.preguntaActual, // Añadido para re-evaluar si la pregunta cambia
    estado.etapaCelebracion, // Añadido para evitar preguntas durante celebración
    estado.isLoading,
    playCrecimiento,
    juegoIniciado,
  ]);

  // --- ACCIONES ---
  const acciones = {
    soltarHerramienta: useCallback((resourceId) => {
      dispatch({
        type: "APPLY_RESOURCE",
        payload: { resourceId, amount: GAME_CONFIG.RESOURCE_INCREASE_ON_DROP },
      });
    }, []),

    agitarHerramienta: useCallback(/* ... sin cambios ... */),

    handleRespuesta: useCallback((esCorrecta) => {
      dispatch({ type: "ANSWER_QUESTION", payload: { esCorrecta } });
    }, []),

    // Modificación: Reiniciar ahora también debe limpiar el estado local inmediatamente
    // y luego el useEffect de guardado se encargará de persistir el estado reiniciado.
    reiniciarHuerto: useCallback(() => {
       console.log("Huerto: Reiniciando juego...");
       dispatch({ type: "RESTART" });
       // El guardado se disparará automáticamente por el cambio de estado
    }, []),

    setPasoTutorial: useCallback((paso) => {
      dispatch({ type: "SET_TUTORIAL_STEP", payload: paso });
    }, []),
  };

  return { estado, acciones };
};
