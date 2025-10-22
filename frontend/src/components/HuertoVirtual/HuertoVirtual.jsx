import React, { useState } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import useSound from "use-sound";

import { nombresEtapas } from "../../constants/gameConfig";
import { useHuertoState } from "./hooks/useHuertoState";
import Planta from "./components/Planta";
import Herramienta from "./components/Herramienta";
import Medidor from "./components/Medidor";
import QuizModal from "./components/QuizModal";
import IndicadorGuardando from "./components/IndicadorGuardando";
import Celebration from "./components/Celebration";
import TutorialBubble from "./components/TutorialBubble";
import HuertoBienvenida from "./components/HuertoBienvenida";

function HuertoVirtual() {
  const [juegoIniciado, setJuegoIniciado] = useState(false);

  const { estado, acciones } = useHuertoState(juegoIniciado);
  const {
    etapa,
    agua,
    sol,
    isSaving,
    preguntaActual,
    respuestasCorrectas,
    etapaCelebracion,
    pasoTutorial,
    isLoading,
    error,
  } = estado;

  const {
    soltarHerramienta,
    agitarHerramienta,
    reiniciarHuerto,
    handleRespuesta,
    setPasoTutorial,
  } = acciones;

  const [activeId, setActiveId] = useState(null);
  const [playDropAgua] = useSound("/5.mp3", { volume: 0.1 });
  const [playDropSol] = useSound("/sonido-sol1.mp3", { volume: 0.1 });

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragMove = ({ active, delta }) => {
    agitarHerramienta(active.id, delta);
  };
  const handleDragEnd = ({ active, over }) => {
    if (over?.id === "planta-area") {
      soltarHerramienta(active.id);
      if (active.id === "agua") playDropAgua();
      if (active.id === "sol") playDropSol();
      if (pasoTutorial === 1 && active.id === "agua") setPasoTutorial(0);
    }
    setActiveId(null);
  };

  const { setNodeRef, isOver } = useDroppable({ id: "planta-area" });

  if (!juegoIniciado) {
    return <HuertoBienvenida onStart={() => setJuegoIniciado(true)} />;
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white text-xl">
        Cargando tu huerto...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-900/80 text-white text-xl p-4 text-center rounded-3xl">
        <div>
          <p className="font-bold text-2xl mb-2">¡Oh no! Algo salió mal.</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <div
        className="text-white p-4 gap-4 w-full h-full flex"
        style={{
          backgroundImage: `url('/fondo-huerto.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AnimatePresence>
          {etapaCelebracion !== null && (
            <Celebration etapaNombre={nombresEtapas[etapaCelebracion]} />
          )}
        </AnimatePresence>
        {isSaving && <IndicadorGuardando />}

        {/* --- ESTE ES EL BLOQUE DE CÓDIGO DE LAS HERRAMIENTAS --- */}
        <aside className="w-1/5 bg-gray-800/50 p-4 rounded-xl flex flex-col items-center gap-4 self-start">
          <h3 className="text-lg font-bold">Herramientas</h3>
          {["agua", "sol"].map((toolId) => (
            <div key={toolId} className="relative">
              <Herramienta
                id={toolId}
                type={toolId}
                isDraggingActive={activeId !== null}
                isCurrentlyDragged={activeId === toolId}
                needsAttention={
                  (toolId === "agua" && agua < 25) ||
                  (toolId === "sol" && sol < 25)
                }
              />
              {pasoTutorial === 1 && toolId === "agua" && (
                <TutorialBubble texto="¡Tu planta tiene sed! Arrastra la gota de agua." />
              )}
            </div>
          ))}
        </aside>
        {/* --- FIN DEL BLOQUE DE LAS HERRAMIENTAS --- */}

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
            className={`bg-sky-800/30 flex-grow rounded-xl flex flex-col items-center justify-center p-4 transition-colors ${
              isOver ? "bg-green-500/20" : ""
            }`}
          >
            <Planta etapa={etapa} />
            <div className="w-1/2 mt-4 space-y-2">
              <Medidor nivel={agua} tipo="agua" />
              <Medidor
                nivel={sol}
                tipo="sol"
                respuestasCorrectas={respuestasCorrectas}
              />
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
