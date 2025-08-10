// client/src/components/HuertoVirtual/HuertoVirtual.jsx

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

function HuertoVirtual() {
  const { estado, acciones } = useHuertoState();
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

  // 👇 La lógica de agitar ahora se pasa al hook
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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white text-xl">
        Cargando tu huerto...
      </div>
    );
  }

  return (
    // 👇 Activamos onDragMove
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <div
        className="flex h-full w-full text-white p-4 gap-4"
        style={{
          backgroundImage: `url('/fondo-huerto.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AnimatePresence>
          {etapaCelebracion !== null && (
            // 👇 Pasamos el nombre de la etapa para un mensaje más claro
            <Celebration etapaNombre={nombresEtapas[etapaCelebracion]} />
          )}
        </AnimatePresence>
        {isSaving && <IndicadorGuardando />}
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
