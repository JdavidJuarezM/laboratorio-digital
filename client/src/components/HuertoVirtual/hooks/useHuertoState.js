import { useState, useEffect, useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { bancoDePreguntas } from "../constants/bancoDePreguntas";
import { fetchHuertoState, saveHuertoState } from "../api/huertoApi";
import useSound from "use-sound";

export const useHuertoState = () => {
  const [etapa, setEtapa] = useState(0);
  const [agua, setAgua] = useState(GAME_CONFIG.INITIAL_RESOURCE_LEVEL);
  const [sol, setSol] = useState(GAME_CONFIG.INITIAL_RESOURCE_LEVEL);
  const [isSaving, setIsSaving] = useState(false);

  // Lógica del Quiz
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [preguntasHechas, setPreguntasHechas] = useState([]);
  const [preguntaMostradaPorMedidor, setPreguntaMostradaPorMedidor] =
    useState(false);

  // Lógica de Guía y Recompensas
  const [pasoTutorial, setPasoTutorial] = useState(0);
  const [etapaCelebracion, setEtapaCelebracion] = useState(null);

  const [playCrecimiento] = useSound("/sonido-crecimiento.mp3", {
    volume: 0.5,
  });

  const saveState = useCallback(async (newState) => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    await saveHuertoState(newState, token);
    setTimeout(() => setIsSaving(false), GAME_CONFIG.SAVING_INDICATOR_DELAY_MS);
  }, []);

  const reiniciarHuerto = useCallback(async () => {
    const estadoInicial = {
      etapa: 0,
      agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
      sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
    };
    setEtapa(estadoInicial.etapa);
    setAgua(estadoInicial.agua);
    setSol(estadoInicial.sol);
    setRespuestasCorrectas(0);
    setPreguntasHechas([]);
    await saveState(estadoInicial);
  }, [saveState]);

  const mostrarSiguientePregunta = useCallback(() => {
    if (preguntaActual || respuestasCorrectas >= 3) return;
    const preguntasDeLaEtapa = bancoDePreguntas[etapa];
    const preguntasDisponibles = preguntasDeLaEtapa.filter(
      (p) => !preguntasHechas.includes(p.pregunta)
    );
    if (preguntasDisponibles.length > 0) {
      const preguntaAleatoria =
        preguntasDisponibles[
          Math.floor(Math.random() * preguntasDisponibles.length)
        ];
      setPreguntaActual(preguntaAleatoria);
      setPreguntasHechas((prev) => [...prev, preguntaAleatoria.pregunta]);
    }
  }, [etapa, respuestasCorrectas, preguntaActual, preguntasHechas]);

  const handleRespuesta = (esCorrecta) => {
    if (esCorrecta) {
      setRespuestasCorrectas((prev) => prev + 1);
    }
    setPreguntaActual(null);
  };

  // --- EFECTOS ---

  // Cargar estado inicial
  useEffect(() => {
    const cargarEstado = async () => {
      const token = localStorage.getItem("token");
      const data = await fetchHuertoState(token);
      if (data) {
        setEtapa(data.etapa);
        setAgua(data.agua);
        setSol(data.sol);
      }
    };
    cargarEstado();
  }, []);

  // Game Tick - Disminuir recursos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setAgua((a) => Math.max(a - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0));
      setSol((s) => Math.max(s - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0));
    }, GAME_CONFIG.GAME_TICK_INTERVAL_MS);
    return () => clearInterval(intervalo);
  }, []);

  // Lógica principal del juego (avanzar etapa, tutorial, mostrar preguntas)
  useEffect(() => {
    const enRango = (n) =>
      n > GAME_CONFIG.GROWTH_THRESHOLD.MIN &&
      n < GAME_CONFIG.GROWTH_THRESHOLD.MAX;

    if (
      etapa < GAME_CONFIG.MAX_PLANT_STAGE &&
      enRango(agua) &&
      enRango(sol) &&
      respuestasCorrectas >= 3
    ) {
      const nuevaEtapa = etapa + 1;
      const nuevo = {
        etapa: nuevaEtapa,
        agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
        sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
      };
      setEtapa(nuevaEtapa);
      setAgua(nuevo.agua);
      setSol(nuevo.sol);
      setRespuestasCorrectas(0);
      setPreguntasHechas([]);

      // --- ¡CORRECCIÓN IMPORTANTE! ---
      setEtapaCelebracion(etapa);
      setTimeout(() => setEtapaCelebracion(null), 3000);

      playCrecimiento();
      saveState(nuevo);
    }

    if (etapa === 0 && pasoTutorial === 0 && agua < 40) {
      setPasoTutorial(1);
    }

    if (
      !preguntaActual &&
      respuestasCorrectas < 3 &&
      !preguntaMostradaPorMedidor &&
      (agua >= 100 || sol >= 100)
    ) {
      const delay = 500 + Math.random() * 1500;
      const timeout = setTimeout(() => {
        mostrarSiguientePregunta();
        setPreguntaMostradaPorMedidor(true);
      }, delay);
      return () => clearTimeout(timeout);
    }

    if (agua < 100 && sol < 100 && preguntaMostradaPorMedidor) {
      setPreguntaMostradaPorMedidor(false);
    }
  }, [
    agua,
    sol,
    etapa,
    respuestasCorrectas,
    saveState,
    playCrecimiento,
    preguntaActual,
    mostrarSiguientePregunta,
    preguntaMostradaPorMedidor,
    pasoTutorial, // Añadido a las dependencias por si acaso
  ]);

  return {
    estado: {
      etapa,
      agua,
      sol,
      isSaving,
      preguntaActual,
      respuestasCorrectas,
      pasoTutorial,
      etapaCelebracion,
    },
    acciones: {
      setAgua,
      setSol,
      setEtapa,
      reiniciarHuerto,
      saveState,
      mostrarSiguientePregunta,
      handleRespuesta,
      setEtapaCelebracion,
      setPasoTutorial,
    },
  };
};
