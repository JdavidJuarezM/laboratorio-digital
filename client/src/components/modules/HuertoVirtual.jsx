// HuertoVirtual.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import useSound from "use-sound";
import axios from "axios";

// --- CONFIGURACIÓN SIMPLIFICADA ---
const GAME_CONFIG = {
  API_BASE_URL: "http://localhost:5000/api",
  INITIAL_RESOURCE_LEVEL: 50,
  RESOURCE_DECREASE_RATE: 5,
  GAME_TICK_INTERVAL_MS: 3000,
  RESOURCE_INCREASE_ON_DROP: 25,
  RESOURCE_INCREASE_ON_SHAKE: 15,
  MAX_RESOURCE_LEVEL: 100,
  GROWTH_THRESHOLD: { MIN: 60, MAX: 95 },
  MAX_PLANT_STAGE: 4,
  SHAKE_DETECTION: { TIME_MS: 300, DISTANCE_PX: 15, COUNT: 3 },
  SAVING_INDICATOR_DELAY_MS: 500,
};

const nombresEtapas = [
  "Germinación",
  "Desarrollo vegetativo",
  "Floración",
  "Desarrollo de frutos y semillas",
  "Maduración y senescencia",
];

// --- API ---
const fetchHuertoState = async (token) => {
  if (!token) return null;
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      `${GAME_CONFIG.API_BASE_URL}/huerto`,
      config
    );
    return data;
  } catch (error) {
    console.error("Error al cargar estado:", error);
    return null;
  }
};

const saveHuertoState = async (stateToSave, token) => {
  if (!token) return;
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(
      `${GAME_CONFIG.API_BASE_URL}/huerto/actualizar`,
      stateToSave,
      config
    );
  } catch (error) {
    console.error("Error al guardar estado:", error);
  }
};

// --- COMPONENTES ---
const IndicadorGuardando = () => (
  <div className="fixed bottom-4 right-4 bg-gray-900 text-white py-2 px-4 rounded shadow animate-pulse">
    Guardando...
  </div>
);

const Herramienta = ({ id, type, isDraggingActive, isShaking }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
      }
    : undefined;

  const icons = {
    agua: "fa-droplet text-blue-400",
    sol: "fa-sun text-yellow-400",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-20 h-20 bg-gray-800 rounded-xl flex flex-col items-center justify-center
      cursor-grab active:cursor-grabbing transition-all duration-200 text-white
      ${
        isDraggingActive
          ? "scale-110 opacity-80 shadow-2xl"
          : "hover:bg-gray-700"
      }
      ${
        isShaking
          ? "animate-pulse border-2 border-green-400"
          : "border-2 border-transparent"
      }`}
    >
      <i className={`fa-solid ${icons[type]} text-3xl`} />
      <span className="text-sm capitalize">{type}</span>
    </div>
  );
};

import { motion, AnimatePresence } from "framer-motion";

const Planta = ({ etapa }) => {
  const stages = {
    0: { stemH: 0, flower: false, color: "bg-green-300" },
    1: { stemH: 60, flower: false, color: "bg-green-400" },
    2: { stemH: 80, flower: false, color: "bg-green-500" },
    3: { stemH: 110, flower: true, color: "bg-green-600" },
    4: { stemH: 125, flower: true, color: "bg-green-700", final: true },
  };
  const currentStage = stages[etapa] || stages[4];
  const stemHeightPx = currentStage.stemH;

  return (
    <div className="relative w-40 h-80 flex flex-col items-center justify-end">
      {/* Maceta */}
      <div className="w-24 h-20 bg-amber-800 rounded-b-lg pt-4 relative z-10 shadow-lg">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[110%] h-5 bg-amber-700 rounded-t-md"></div>
      </div>

      {/* Contenedor de la planta */}
      <div className="absolute bottom-20 w-full h-60 flex items-end justify-center">
        {/* Tallo */}
        <motion.div
          className={`w-2 rounded-t-full origin-bottom absolute bottom-0 z-0 ${currentStage.color}`}
          initial={{ height: 0 }}
          animate={{
            height: stemHeightPx,
            rotate: [0, -2, 2, -1, 1, 0],
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* --- SECCIÓN DE HOJAS CON NUEVA TÉCNICA --- */}

        {/* Primer par de hojas */}
        <AnimatePresence>
          {etapa > 0 && (
            // Contenedor invisible para el par de hojas, centrado
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: "25px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -2, 0] }}
              transition={{
                opacity: { delay: 0.5 },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                },
              }}
            >
              {/* Hoja Izquierda */}
              <div
                className={`absolute bottom-0 right-1 w-10 h-5 rounded-full ${currentStage.color}`}
                style={{ transform: "rotate(-40deg)" }}
              />
              {/* Hoja Derecha */}
              <div
                className={`absolute bottom-0 left-1 w-10 h-5 rounded-full ${currentStage.color}`}
                style={{ transform: "rotate(40deg)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Segundo par de hojas */}
        <AnimatePresence>
          {etapa > 1 && (
            // Contenedor invisible para el par de hojas, centrado
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: "55px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -2, 0] }}
              transition={{
                opacity: { delay: 0.7 },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7,
                },
              }}
            >
              {/* Hoja Izquierda */}
              <div
                className={`absolute bottom-0 right-1 w-10 h-5 rounded-full ${currentStage.color}`}
                style={{ transform: "rotate(-40deg)" }}
              />
              {/* Hoja Derecha */}
              <div
                className={`absolute bottom-0 left-1 w-10 h-5 rounded-full ${currentStage.color}`}
                style={{ transform: "rotate(40deg)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flor */}
        <AnimatePresence>
          {currentStage.flower && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-16 h-16 origin-bottom"
              style={{ bottom: `${stemHeightPx}px` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                scale: { type: "spring", stiffness: 200, delay: 0.5 },
                opacity: { duration: 0.5, delay: 0.5 },
              }}
            >
              <div className="absolute bottom-0 left-2 w-6 h-6 bg-yellow-300 rounded-full -translate-x-1/2 translate-y-1/2 z-10" />
              {[0, 60, 120, 180, 240, 300].map((rot) => (
                <motion.div
                  key={rot}
                  className="absolute bottom-0 left-0 w-4 h-6 bg-pink-400 rounded-full -translate-x-1/2 origin-bottom"
                  animate={{
                    rotate: rot,
                    scale: currentStage.final ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
// --- MEDIDOR DE RECURSOS ---
// Muestra el nivel de agua o sol como una barra de progreso

const Medidor = ({ nivel, tipo }) => {
  const colores = { agua: "bg-blue-500", sol: "bg-yellow-400" };
  return (
    <div className="w-full">
      <div className="bg-gray-700 h-4 rounded-full overflow-hidden">
        <div
          className={`h-full ${colores[tipo]} transition-all duration-300`}
          style={{ width: `${nivel}%` }}
        />
      </div>
    </div>
  );
};

// --- Banco de preguntas ---

const bancoDePreguntas = {
  0: [
    // Etapa 0: Germinación
    {
      pregunta: "¿Qué necesita una semilla para germinar y empezar a crecer?",
      opciones: ["La luz del sol", "El agua", "El viento"],
      correcta: "El agua",
    },
    {
      pregunta:
        "Cuando una semilla germina, ¿qué parte crece primero hacia abajo?",
      opciones: ["El tallo", "La raíz", "La primera hoja"],
      correcta: "La raíz",
    },
    {
      pregunta: "¿Cuál es la función principal de la cáscara de una semilla?",
      opciones: ["Guardar alimento", "Proteger el interior", "Absorber agua"],
      correcta: "Proteger el interior",
    },
  ],
  1: [
    // Etapa 1: Crecimiento (Tallo y Hojas)
    {
      pregunta:
        "¿Mediante qué proceso las hojas usan la luz solar para crear su alimento?",
      opciones: ["Respiración", "Fotosíntesis", "Polinización"],
      correcta: "Fotosíntesis",
    },
    {
      pregunta:
        "Las hojas son como los 'paneles solares' de la planta porque su trabajo es:",
      opciones: [
        "Liberar agua",
        "Capturar la energía de la luz",
        "Proteger al tallo",
      ],
      correcta: "Capturar la energía de la luz",
    },
    {
      pregunta: "¿Cuál es una de las funciones más importantes del tallo?",
      opciones: [
        "Absorber nutrientes",
        "Transportar el agua a las hojas",
        "Crear las semillas",
      ],
      correcta: "Transportar el agua a las hojas",
    },
  ],
  2: [
    // Etapa 2: Floración
    {
      pregunta: "¿Por qué las flores suelen tener colores y olores llamativos?",
      opciones: [
        "Para avisar que son peligrosas",
        "Para atraer a animales polinizadores",
        "Para hablar con otras plantas",
      ],
      correcta: "Para atraer a animales polinizadores",
    },
    {
      pregunta:
        "El proceso de mover el polen de una flor a otra para crear semillas se llama:",
      opciones: ["Fertilización", "Polinización", "Germinación"],
      correcta: "Polinización",
    },
    {
      pregunta: "¿Qué parte colorida de la flor ayuda a atraer a los insectos?",
      opciones: ["El tallo", "Los pétalos", "El pistilo"],
      correcta: "Los pétalos",
    },
  ],
  3: [
    // Etapa 3: El Fruto y la Semilla
    {
      pregunta:
        "Después de que una flor es polinizada, se transforma para proteger a las nuevas semillas. ¿En qué se convierte?",
      opciones: ["En más hojas", "En el fruto", "En un tallo más grueso"],
      correcta: "En el fruto",
    },
    {
      pregunta:
        "¿Cuál es la misión principal de una semilla que está dentro de un fruto?",
      opciones: [
        "Darle un buen sabor al fruto",
        "Convertirse en una nueva planta",
        "Alimentar a la planta original",
      ],
      correcta: "Convertirse en una nueva planta",
    },
    {
      pregunta:
        "¿Por qué a una planta le sirve que los animales se coman sus frutos?",
      opciones: [
        "Para no pesar tanto",
        "Para que el animal lleve las semillas a otros lugares",
        "Para que el animal no se coma sus hojas",
      ],
      correcta: "Para que el animal lleve las semillas a otros lugares",
    },
  ],
  4: [
    // Etapa 4: El Ciclo de Vida
    {
      pregunta:
        "Toda la 'información' sobre cómo será la nueva planta (su color, su tamaño, etc.) está guardada en:",
      opciones: ["El agua", "La semilla", "La luz del sol"],
      correcta: "La semilla",
    },
    {
      pregunta:
        "Que una semilla crezca, se convierta en planta y produzca nuevas semillas para empezar de nuevo, se conoce como:",
      opciones: [
        "El ciclo del agua",
        "El ciclo de vida",
        "La cadena alimenticia",
      ],
      correcta: "El ciclo de vida",
    },
    {
      pregunta:
        "¿Qué tres cosas son fundamentales para que la mayoría de las plantas puedan vivir?",
      opciones: [
        "Viento, rocas y sombra",
        "Luz del sol, agua y aire (dióxido de carbono)",
        "Oxígeno, tierra y frío",
      ],
      correcta: "Luz del sol, agua y aire (dióxido de carbono)",
    },
  ],
};
{
}
// --- COMPONENTE DEL MODAL DE PREGUNTAS ---
const QuizModal = ({ pregunta, onRespuesta }) => {
  const [feedback, setFeedback] = useState("");

  const handleOpcionClick = (opcion) => {
    const esCorrecta = opcion === pregunta.correcta;
    setFeedback(esCorrecta ? "¡Correcto!" : "Inténtalo de nuevo");

    setTimeout(() => {
      onRespuesta(esCorrecta);
      setFeedback(""); // Limpiar feedback para la próxima pregunta
    }, 1500); // Espera 1.5 segundos para que el usuario vea el feedback
  };

  return (
    <motion.div
      className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center"
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          {pregunta.pregunta}
        </h2>
        <div className="grid grid-cols-1 gap-3 my-6">
          {pregunta.opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => handleOpcionClick(opcion)}
              disabled={!!feedback} // Deshabilita botones después de responder
              className="bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {opcion}
            </button>
          ))}
        </div>

        {feedback && (
          <p
            className={`text-xl font-bold ${
              feedback === "¡Correcto!" ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- Huerto Virtual ---
// --- COMPONENTE PRINCIPAL ---
function HuertoVirtual() {
  const [preguntaActual, setPreguntaActual] = useState(null); // Para guardar la pregunta que se mostrará
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0); // Contador de aciertos por etapa
  const [preguntasHechas, setPreguntasHechas] = useState([]); // Para no repetir preguntas en la misma etapa
  const [etapa, setEtapa] = useState(0);
  const [agua, setAgua] = useState(GAME_CONFIG.INITIAL_RESOURCE_LEVEL);
  const [sol, setSol] = useState(GAME_CONFIG.INITIAL_RESOURCE_LEVEL);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [shakingIcons, setShakingIcons] = useState({ agua: false, sol: false });
  const shakeDataRef = useRef({
    agua: { count: 0, lastTime: 0, lastDir: null },
    sol: { count: 0, lastTime: 0, lastDir: null },
  });

  // Dentro de HuertoVirtual, junto a tus otras funciones
  const mostrarSiguientePregunta = useCallback(() => {
    console.log("Intentando mostrar pregunta...");

    // Si ya hay una pregunta o ya se completaron las 3, no hacer nada
    if (preguntaActual || respuestasCorrectas >= 3) return;

    const preguntasDeLaEtapa = bancoDePreguntas[etapa];
    // Filtrar para no repetir preguntas
    const preguntasDisponibles = preguntasDeLaEtapa.filter(
      (p) => !preguntasHechas.includes(p.pregunta)
    );

    if (preguntasDisponibles.length > 0) {
      const preguntaAleatoria =
        preguntasDisponibles[
          Math.floor(Math.random() * preguntasDisponibles.length)
        ];
      setPreguntaActual(preguntaAleatoria);
      // Marcar la pregunta como hecha
      setPreguntasHechas((prev) => [...prev, preguntaAleatoria.pregunta]);
    }
  }, [etapa, respuestasCorrectas, preguntaActual, preguntasHechas]);

  const handleRespuesta = (esCorrecta) => {
    if (esCorrecta) {
      setRespuestasCorrectas((prev) => prev + 1);
    }

    setPreguntaActual(null);
  };

  const [playAgua] = useSound("/5.mp3", { volume: 0.1 });
  const [playSol] = useSound("/sonido-sol1.mp3", { volume: 0.1 });
  const [playCrecimiento] = useSound("/sonido-crecimiento.mp3", {
    volume: 0.5,
  });

  const [playShakeAgua, { stop: stopShakeAgua, isPlaying: isAguaPlaying }] =
    useSound("/sonido-agua.mp3", { loop: true });
  const [playShakeSol, { stop: stopShakeSol, isPlaying: isSolPlaying }] =
    useSound("/sonido-sol.mp3", { loop: true });

  const herramientas = ["agua", "sol"];

  const saveState = useCallback(async (newState) => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    await saveHuertoState(newState, token);
    setTimeout(() => setIsSaving(false), GAME_CONFIG.SAVING_INDICATOR_DELAY_MS);
  }, []);

  const reiniciarHuerto = useCallback(async () => {
    const estado = {
      etapa: 0,
      agua: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
      sol: GAME_CONFIG.INITIAL_RESOURCE_LEVEL,
    };
    setEtapa(0);
    setAgua(estado.agua);
    setSol(estado.sol);
    await saveState(estado);
  }, [saveState]);

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

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAgua((a) => Math.max(a - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0));
      setSol((s) => Math.max(s - GAME_CONFIG.RESOURCE_DECREASE_RATE, 0));
    }, GAME_CONFIG.GAME_TICK_INTERVAL_MS);
    return () => clearInterval(intervalo);
  }, []);

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

      playCrecimiento();
      saveState(nuevo);
    }
  }, [agua, sol, etapa, saveState, playCrecimiento, respuestasCorrectas]);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    stopShakeAgua();
    stopShakeSol();
    if (over?.id === "planta-area") {
      console.log("Recurso soltado sobre la planta:", active.id);

      const id = active.id;
      let nuevaAgua = agua;
      let nuevoSol = sol;

      if (id === "agua") {
        nuevaAgua = Math.min(
          agua + GAME_CONFIG.RESOURCE_INCREASE_ON_DROP,
          GAME_CONFIG.MAX_RESOURCE_LEVEL
        );
        playDropAgua(); // CORREGIDO: Se llama solo si es agua
      }

      if (id === "sol") {
        nuevoSol = Math.min(
          sol + GAME_CONFIG.RESOURCE_INCREASE_ON_DROP,
          GAME_CONFIG.MAX_RESOURCE_LEVEL
        );
        playDropSol(); // CORREGIDO: Se llama solo si es sol
      }

      setAgua(nuevaAgua);
      setSol(nuevoSol);
      saveState({ etapa, agua: nuevaAgua, sol: nuevoSol });
      setTimeout(mostrarSiguientePregunta, 800); // Muestra una pregunta tras un breve delay
    }
    setActiveId(null);
  };

  const handleDragMove = ({ active, delta }) => {
    const id = active.id;

    if (!["agua", "sol"].includes(id)) return;

    const now = Date.now();
    const datos = shakeDataRef.current[id];
    const currentDir =
      delta.x > 0 ? "derecha" : delta.x < 0 ? "izquierda" : null;

    const cambiado =
      currentDir && datos.lastDir && currentDir !== datos.lastDir;
    const rapido = now - datos.lastTime < GAME_CONFIG.SHAKE_DETECTION.TIME_MS;
    const suficiente =
      Math.abs(delta.x) > GAME_CONFIG.SHAKE_DETECTION.DISTANCE_PX;

    if (cambiado && rapido && suficiente) {
      datos.count++;
      if (datos.count >= GAME_CONFIG.SHAKE_DETECTION.COUNT) {
        if (id === "agua" && !isAguaPlaying) {
          playShakeAgua();
        }
        if (id === "sol" && !isSolPlaying) {
          playShakeSol();
        }
        const nuevaAgua =
          id === "agua"
            ? Math.min(
                agua + GAME_CONFIG.RESOURCE_INCREASE_ON_SHAKE,
                GAME_CONFIG.MAX_RESOURCE_LEVEL
              )
            : agua;
        const nuevoSol =
          id === "sol"
            ? Math.min(
                sol + GAME_CONFIG.RESOURCE_INCREASE_ON_SHAKE,
                GAME_CONFIG.MAX_RESOURCE_LEVEL
              )
            : sol;

        if (id === "agua") playAgua();
        if (id === "sol") playSol();

        setAgua(nuevaAgua);
        setSol(nuevoSol);
        saveState({ etapa, agua: nuevaAgua, sol: nuevoSol });
        setShakingIcons((prev) => ({ ...prev, [id]: true }));
        setTimeout(
          () => setShakingIcons((prev) => ({ ...prev, [id]: false })),
          500
        );
        datos.count = 0;
      }
    }

    datos.lastTime = now;
    datos.lastDir = currentDir;
  };

  const { setNodeRef } = useDroppable({ id: "planta-area" });

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <div
        className="flex h-full w-full text-white p-4 gap-4"
        style={{
          backgroundImage: `url('/fondo-huerto.jpg')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {isSaving && <IndicadorGuardando />}

        <aside className="w-1/fivth bg-gray-800/50 p-4 rounded-xl flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold">Herramientas</h3>
          {herramientas.map((tool) => (
            <Herramienta
              key={tool}
              id={tool}
              type={tool}
              isDraggingActive={activeId === tool}
              isShaking={shakingIcons[tool] || false}
            />
          ))}
        </aside>

        <main className="w-4/5 flex flex-col gap-4">
          <div className="bg-gray-800/50 p-4 rounded-xl flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Etapa {etapa}: {nombresEtapas[etapa]}
            </h2>
            <button
              onClick={reiniciarHuerto}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Reiniciar
            </button>
          </div>

          <div
            ref={setNodeRef}
            className="bg-sky-800/30 flex-grow rounded-xl flex flex-col items-center justify-center p-4"
          >
            <Planta etapa={etapa} />
            <div className="w-1/2 mt-4 space-y-2">
              <Medidor nivel={agua} tipo="agua" />
              <Medidor nivel={sol} tipo="sol" />
            </div>
          </div>
        </main>
        {/* 👇 AÑADE ESTE BLOQUE AL FINAL */}
        <button
          onClick={mostrarSiguientePregunta}
          className="bg-cyan-600 px-4 py-2 rounded mt-4"
        >
          Mostrar pregunta
        </button>
        <AnimatePresence>
          {preguntaActual && (
            <QuizModal
              pregunta={preguntaActual}
              onRespuesta={handleRespuesta}
            />
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
}

export default HuertoVirtual;
