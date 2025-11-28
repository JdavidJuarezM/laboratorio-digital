// frontend/src/components/HuertoVirtual/hooks/useHuertoState.js

import {useReducer, useEffect, useCallback, useRef} from "react";
import useSound from "use-sound";
import { getEstadoHuerto } from "../../../services/huertoService";
import { GAME_CONFIG, WEATHER_TYPES } from "../../../constants/gameConfig";
import { bancoDePreguntas as preguntasDefault } from "../../../constants/bancoDePreguntas";

// Servicios para conectar con la BD
import { actualizarProgresoAlumno, getAlumnos } from "../../../services/alumnosService";
import { getPreguntas } from "../../../services/preguntasService";

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
    clima: WEATHER_TYPES.SUNNY.id,
    notificacionClima: "",
    bancoPreguntas: null, // Aquí guardaremos las preguntas cargadas de la BD
};

function gameReducer(state, action) {
    switch (action.type) {
        case "SET_INITIAL_STATE":
            return {...state, ...action.payload, isLoading: false, error: null};

        case "SET_LOADING_ERROR":
            return {...state, isLoading: false, error: action.payload};

        case "SET_BANCO_PREGUNTAS":
            return { ...state, bancoPreguntas: action.payload };

        case "GAME_TICK": {
            const currentWeather = Object.values(WEATHER_TYPES).find(w => w.id === state.clima) || WEATHER_TYPES.SUNNY;
            let nuevoNivelAgua = state.agua;

            if (currentWeather.id === 'rainy') {
                nuevoNivelAgua = Math.min(state.agua + 2, GAME_CONFIG.MAX_RESOURCE_LEVEL);
            } else {
                const decrease = GAME_CONFIG.RESOURCE_DECREASE_RATE * currentWeather.waterMod;
                nuevoNivelAgua = Math.max(state.agua - decrease, 0);
            }

            const nuevoNivelSol = Math.max(state.sol - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0);

            return {
                ...state,
                agua: nuevoNivelAgua,
                sol: nuevoNivelSol,
            };
        }

        case "CHANGE_WEATHER":
            return {
                ...state,
                clima: action.payload.id,
                notificacionClima: action.payload.message
            };

        case "CLEAR_NOTIFICATION":
            return {...state, notificacionClima: ""};

        case "APPLY_RESOURCE": {
            const {resourceId, amount} = action.payload;
            if (resourceId !== "agua" && resourceId !== "sol") return state;
            return {
                ...state,
                [resourceId]: Math.min(
                    state[resourceId] + amount,
                    GAME_CONFIG.MAX_RESOURCE_LEVEL
                ),
            };
        }

        case "SHOW_QUESTION": {
            if (state.preguntaActual || state.respuestasCorrectas >= 3) return state;

            // Usamos el banco cargado de la BD o el default si no hay
            const banco = state.bancoPreguntas || preguntasDefault;

            // Buscamos preguntas de la etapa actual que no se hayan hecho
            const preguntasDisponibles = (banco[state.etapa] || []).filter(
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
                };
            }
            return state;
        }

        case "ANSWER_QUESTION": {
            const esCorrecta = action.payload.esCorrecta;

            // Si es correcta, la guardamos para no repetirla. Si falla, NO la guardamos para que vuelva a salir.
            const nuevasPreguntasHechas = esCorrecta
                ? [...state.preguntasHechas, state.preguntaActual.pregunta]
                : state.preguntasHechas;

            return {
                ...state,
                preguntaActual: null,
                preguntasHechas: nuevasPreguntasHechas,
                respuestasCorrectas:
                    state.respuestasCorrectas + (esCorrecta ? 1 : 0),
                // Bajamos recursos a 90 para romper el bucle infinito
                agua: state.agua >= 100 ? 90 : state.agua,
                sol: state.sol >= 100 ? 90 : state.sol,
            };
        }

        case "ADVANCE_STAGE": {
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
        }
        case "HIDE_CELEBRATION":
            return {...state, etapaCelebracion: null};

        case "RESTART":
            return {...initialState, isLoading: false, pasoTutorial: 0, bancoPreguntas: state.bancoPreguntas};

        case "SET_TUTORIAL_STEP":
            return {...state, pasoTutorial: action.payload};

        case "SET_SAVING":
            return {...state, isSaving: action.payload};

        default:
            throw new Error(`Acción desconocida: ${action.type}`);
    }
}

export const useHuertoState = (juegoIniciado) => {
    const [estado, dispatch] = useReducer(gameReducer, initialState);
    const [playCrecimiento] = useSound("/sonido-crecimiento.mp3", {volume: 0.5});

    const shakeDataRef = useRef({history: [], lastApplied: 0, lastX: 0, lastY: 0});
    const isCurrentlySaving = useRef(false);

    // 1. CARGA INICIAL: Recuperar progreso del alumno desde BD y Preguntas
    useEffect(() => {
        if (juegoIniciado) {
            const cargarDatos = async () => {
                try {
                    // A. Cargar preguntas de la BD
                    const preguntasBD = await getPreguntas();
                    if (preguntasBD) {
                        dispatch({ type: "SET_BANCO_PREGUNTAS", payload: preguntasBD });
                    }

                    // B. Cargar progreso del alumno
                    const studentId = sessionStorage.getItem("current_student_id");
                    if (studentId) {
                        const listaAlumnos = await getAlumnos();
                        const alumno = listaAlumnos.find(a => a.id.toString() === studentId);

                        if (alumno) {
                            dispatch({type: "SET_INITIAL_STATE", payload: {
                                etapa: alumno.etapa,
                                respuestasCorrectas: alumno.aciertos,
                                agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
                                sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
                                clima: initialState.clima
                            }});
                        } else {
                            dispatch({type: "SET_INITIAL_STATE", payload: {...initialState, isLoading: false}});
                        }
                    } else {
                        // Jugar sin alumno (modo prueba)
                        dispatch({type: "SET_INITIAL_STATE", payload: {...initialState, isLoading: false}});
                    }
                } catch (err) {
                    console.error("Error inicializando huerto:", err);
                    dispatch({type: "SET_LOADING_ERROR", payload: "Error de conexión."});
                }
            };
            cargarDatos();
        }
    }, [juegoIniciado]);

    // 2. Sistema de Clima
    useEffect(() => {
        if (!juegoIniciado || estado.isLoading) return;
        const weatherInterval = setInterval(() => {
            const random = Math.random();
            let nextWeather;
            if (random < 0.6) nextWeather = WEATHER_TYPES.SUNNY;
            else if (random < 0.8) nextWeather = WEATHER_TYPES.RAINY;
            else nextWeather = WEATHER_TYPES.HEATWAVE;

            if (nextWeather.id !== estado.clima) {
                dispatch({type: "CHANGE_WEATHER", payload: nextWeather});
                setTimeout(() => dispatch({type: "CLEAR_NOTIFICATION"}), 4000);
            }
        }, 15000);
        return () => clearInterval(weatherInterval);
    }, [juegoIniciado, estado.isLoading, estado.clima]);

    // 3. GUARDADO AUTOMÁTICO EN BD
    useEffect(() => {
        if (estado.isLoading || !juegoIniciado || isCurrentlySaving.current) return;

        const handler = setTimeout(async () => {
            isCurrentlySaving.current = true;
            dispatch({type: "SET_SAVING", payload: true});

            const {etapa, respuestasCorrectas} = estado;
            const studentId = sessionStorage.getItem("current_student_id");

            try {
                if (studentId) {
                    await actualizarProgresoAlumno(studentId, etapa, respuestasCorrectas);
                }
            } catch (error) {
                console.error("Huerto: Error guardando en BD:", error);
            } finally {
                setTimeout(() => {
                    dispatch({type: "SET_SAVING", payload: false});
                    isCurrentlySaving.current = false;
                }, GAME_CONFIG.SAVING_INDICATOR_DELAY_MS);
            }
        }, 2000); // Guardar cada 2s

        return () => clearTimeout(handler);
    }, [estado.etapa, estado.respuestasCorrectas, juegoIniciado, estado.isLoading]);

    // 4. Game Tick
    useEffect(() => {
        if (juegoIniciado && !estado.isLoading) {
            const intervalo = setInterval(() => dispatch({type: "GAME_TICK"}), GAME_CONFIG.GAME_TICK_INTERVAL_MS);
            return () => clearInterval(intervalo);
        }
    }, [juegoIniciado, estado.isLoading]);

    // 5. Lógica de Crecimiento
    useEffect(() => {
        if (juegoIniciado && !estado.isLoading) {
            const {etapa, agua, sol, respuestasCorrectas, preguntaActual} = estado;
            const enRango = (n) => n >= GAME_CONFIG.GROWTH_THRESHOLD.MIN && n <= GAME_CONFIG.GROWTH_THRESHOLD.MAX;

            if (etapa < GAME_CONFIG.MAX_PLANT_STAGE && enRango(agua) && enRango(sol) && respuestasCorrectas >= 3) {
                dispatch({type: "ADVANCE_STAGE"});
                playCrecimiento();
                setTimeout(() => dispatch({type: "HIDE_CELEBRATION"}), 4000);
            }

            if (!preguntaActual && !estado.etapaCelebracion && (agua >= 100 || sol >= 100)) {
                dispatch({type: "SHOW_QUESTION"});
            }
        }
    }, [estado.agua, estado.sol, estado.respuestasCorrectas, estado.etapa, estado.preguntaActual, estado.etapaCelebracion, estado.isLoading, playCrecimiento, juegoIniciado]);

    const acciones = {
        soltarHerramienta: useCallback(() => {
            const ref = shakeDataRef.current;
            ref.history = [];
            ref.lastX = 0;
            ref.lastY = 0;
        }, []),

        agitarHerramienta: useCallback((resourceId, delta) => {
            if (resourceId !== "agua" && resourceId !== "sol") return;

            const now = Date.now();
            const shakeConfig = GAME_CONFIG.SHAKE_DETECTION;
            const ref = shakeDataRef.current;

            // 1. Velocidad horizontal instantánea
            const moveX = delta.x - ref.lastX;
            ref.lastX = delta.x;
            ref.lastY = delta.y;

            while (ref.history.length > 0 && ref.history[0].timestamp < now - shakeConfig.TIME_MS) {
                ref.history.shift();
            }

            const speedX = Math.abs(moveX);

            // 2. Registrar solo velocidad horizontal significativa
            if (speedX > shakeConfig.DISTANCE_PX) {
                const direction = Math.sign(moveX);
                ref.history.push({timestamp: now, speed: speedX, direction});
            }

            // 3. VALIDACIÓN ESTRICTA: Ida y vuelta
            const hasLeft = ref.history.some(item => item.direction < 0);
            const hasRight = ref.history.some(item => item.direction > 0);
            const isShakeValid = hasLeft && hasRight;

            if (
                ref.history.length >= shakeConfig.COUNT &&
                isShakeValid &&
                now - ref.lastApplied > shakeConfig.TIME_MS
            ) {
                const totalSpeed = ref.history.reduce((sum, item) => sum + item.speed, 0);
                const averageSpeed = totalSpeed / ref.history.length;

                // 4. Puntos lentos (1 a 5)
                const cantidadDinamica = Math.min(Math.max(Math.floor(averageSpeed * 0.15), 1), 5);

                ref.lastApplied = now;
                ref.history = [];

                dispatch({type: "APPLY_RESOURCE", payload: {resourceId, amount: cantidadDinamica}});
            }
        }, []),

        handleRespuesta: useCallback((esCorrecta) => {
            dispatch({type: "ANSWER_QUESTION", payload: {esCorrecta}});
        }, []),

        reiniciarHuerto: useCallback(() => {
            dispatch({type: "RESTART"});
        }, []),

        setPasoTutorial: useCallback((paso) => {
            dispatch({type: "SET_TUTORIAL_STEP", payload: paso});
        }, []),
    };

    return {estado, acciones};
};