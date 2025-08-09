import React, { useState, useRef } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import TutorialBubble from "./components/TutorialBubble";
// --- Importaciones de nuestros módulos ---
import { GAME_CONFIG, nombresEtapas } from "./constants/gameConfig";
import { useHuertoState } from "./hooks/useHuertoState";
import Planta from "./components/Planta";
import Herramienta from "./components/Herramienta";
import Medidor from "./components/Medidor";
import QuizModal from "./components/QuizModal";
import IndicadorGuardando from "./components/IndicadorGuardando";
import Celebration from "./components/Celebration";

function HuertoVirtual() {
  // Nuestro hook se encarga de casi toda la lógica
  const { estado, acciones } = useHuertoState();
  const { etapaCelebracion } = estado; // Obtenemos la etapa de celebración
  const { pasoTutorial } = estado; // Obtenemos el paso del tutorial
  const { setPasoTutorial } = acciones; // Y la acción para cambiarlo
  const { etapa, agua, sol, isSaving, preguntaActual, respuestasCorrectas } =
    estado;
  const {
    setAgua,
    setSol,
    saveState,
    reiniciarHuerto,
    handleRespuesta,
    setEtapaCelebracion,
  } = acciones;

  // Estados y refs que pertenecen a la vista y la interacción directa
  const [activeId, setActiveId] = useState(null);
  const [shakingIcons, setShakingIcons] = useState({ agua: false, sol: false });
  const shakeDataRef = useRef({
    agua: { count: 0, lastTime: 0, lastDir: null },
    sol: { count: 0, lastTime: 0, lastDir: null },
  });

  // --- Sonidos de interacción ---
  const [playDropAgua] = useSound("/5.mp3", { volume: 0.1 });
  const [playDropSol] = useSound("/sonido-sol1.mp3", { volume: 0.1 });
  const [playShakeAgua, { stop: stopShakeAgua, isPlaying: isAguaPlaying }] =
    useSound("/sonido-agua.mp3", { loop: true });
  const [playShakeSol, { stop: stopShakeSol, isPlaying: isSolPlaying }] =
    useSound("/sonido-sol.mp3", { loop: true });

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    console.log("Drag finalizado:", {
      pasoTutorial_actual: pasoTutorial,
      id_activo: active.id,
      id_sobre: over?.id,
    });
    stopShakeAgua();
    stopShakeSol();

    if (over?.id === "planta-area") {
      const recurso = active.id;
      let nuevaAgua = agua;
      let nuevoSol = sol;

      if (recurso === "agua") {
        nuevaAgua = Math.min(
          agua + GAME_CONFIG.RESOURCE_INCREASE_ON_DROP,
          GAME_CONFIG.MAX_RESOURCE_LEVEL
        );
        playDropAgua();
      }
      if (recurso === "sol") {
        nuevoSol = Math.min(
          sol + GAME_CONFIG.RESOURCE_INCREASE_ON_DROP,
          GAME_CONFIG.MAX_RESOURCE_LEVEL
        );
        playDropSol();
      }

      setAgua(nuevaAgua);
      setSol(nuevoSol);
      saveState({ etapa, agua: nuevaAgua, sol: nuevoSol });
    }
    setActiveId(null);
    if (
      pasoTutorial === 1 &&
      active.id === "agua" &&
      over?.id === "planta-area"
    ) {
      setPasoTutorial(0);
    }
  };

  // --- LÓGICA DE AGITAR RESTAURADA ---
  const handleDragMove = ({ active, delta }) => {
    const id = active.id;
    if (!["agua", "sol"].includes(id)) return;

    const now = Date.now();
    const datos = shakeDataRef.current[id];
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
        if (id === "agua" && !isAguaPlaying) playShakeAgua();
        if (id === "sol" && !isSolPlaying) playShakeSol();

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
  const necesitaAgua = agua < 25 && etapa < GAME_CONFIG.MAX_PLANT_STAGE;
  const necesitaSol = sol < 25 && etapa < GAME_CONFIG.MAX_PLANT_STAGE;

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
        <AnimatePresence>
          {etapaCelebracion !== null && (
            <Celebration etapa={etapaCelebracion} />
          )}
        </AnimatePresence>
        {isSaving && <IndicadorGuardando />}
        <aside className="w-1/5 bg-gray-800/50 p-4 rounded-xl flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold">Herramientas</h3>
          {["agua", "sol"].map((tool) => (
            <div key={tool} className="relative">
              <Herramienta
                key={tool}
                id={tool}
                type={tool}
                isDraggingActive={activeId === tool}
                isShaking={shakingIcons[tool]}
                needsAttention={tool === "agua" ? necesitaAgua : necesitaSol}
              />
              {/* NUEVO: Mostramos la burbuja si es el paso correcto */}
              {pasoTutorial === 1 && tool === "agua" && (
                <TutorialBubble
                  texto="¡Tu planta tiene sed! Arrastra la gota de agua hasta ella."
                  posicion="-bottom-full mb-2" // Posicionamos debajo del icono
                />
              )}
            </div>
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
              <div className="text-center text-white mt-2">
                <div className="inline-flex items-center gap-2 bg-cyan-800/70 px-4 py-2 rounded-full shadow-md">
                  <span className="text-lg font-bold">✅</span>
                  <span className="text-sm font-semibold">
                    Respuestas correctas: {respuestasCorrectas} / 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
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
