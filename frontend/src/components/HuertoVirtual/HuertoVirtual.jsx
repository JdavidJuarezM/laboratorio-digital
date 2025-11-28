// client/src/components/HuertoVirtual/HuertoVirtual.jsx

import React, {useState} from "react";
import {DndContext, useDroppable} from "@dnd-kit/core";
import {AnimatePresence, motion} from "framer-motion";
import useSound from "use-sound";
import WeatherFX from "./components/WeatherFX";
import {nombresEtapas, WEATHER_TYPES} from "../../constants/gameConfig";
import {useHuertoState} from "./hooks/useHuertoState";
import Planta from "./components/Planta";
import Herramienta from "./components/Herramienta";
import Medidor from "./components/Medidor";
import QuizModal from "./components/QuizModal";
import IndicadorGuardando from "./components/IndicadorGuardando";
import Celebration from "./components/Celebration";
import TutorialBubble from "./components/TutorialBubble";
import HuertoBienvenida from "./components/HuertoBienvenida";
import {bancoDePreguntas as preguntasDefault} from "../../constants/bancoDePreguntas";

function HuertoVirtual() {
    const [juegoIniciado, setJuegoIniciado] = useState(false);

    const {estado, acciones} = useHuertoState(juegoIniciado);
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
        clima,
        notificacionClima,
        bancoPreguntas,
    } = estado;

    const {
        soltarHerramienta,
        agitarHerramienta,
        reiniciarHuerto,
        handleRespuesta,
        setPasoTutorial,
    } = acciones;

    const [activeId, setActiveId] = useState(null);
    const [playDropAgua] = useSound("/5.mp3", {volume: 0.1});
    const [playDropSol] = useSound("/sonido-sol1.mp3", {volume: 0.1});

    const handleDragStart = ({active}) => setActiveId(active.id);
    const handleDragMove = ({active, delta}) => {
        agitarHerramienta(active.id, delta);
    };
    const handleDragEnd = ({active, over}) => {
        if (over?.id === "planta-area") {
            soltarHerramienta(active.id);
            if (active.id === "agua") playDropAgua();
            if (active.id === "sol") playDropSol();
            if (pasoTutorial === 1 && active.id === "agua") setPasoTutorial(0);
        }
        setActiveId(null);
    };

    const {setNodeRef, isOver} = useDroppable({id: "planta-area"});

    const currentWeatherInfo =
        Object.values(WEATHER_TYPES).find((w) => w.id === clima) ||
        WEATHER_TYPES.SUNNY;

    if (!juegoIniciado) {
        return <HuertoBienvenida onStart={() => setJuegoIniciado(true)}/>;
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
            <div
                className="flex h-full w-full items-center justify-center bg-red-900/80 text-white text-xl p-4 text-center rounded-3xl">
                <div>
                    <p className="font-bold text-2xl mb-2">¡Oh no! Algo salió mal.</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    // --- CÁLCULO DEL TOTAL ---
    const bancoActual = bancoPreguntas || preguntasDefault;
    const totalPreguntasEtapa = bancoActual[etapa]?.length || 3;

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <div
                // MODIFICADO: flex-col para móvil (columna), md:flex-row para escritorio (fila)
                className="text-white p-2 md:p-4 gap-4 w-full h-full flex flex-col md:flex-row overflow-hidden"
                style={{
                    backgroundImage: `url('/fondo-huerto.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <WeatherFX clima={clima}/>
                <AnimatePresence>
                    {etapaCelebracion !== null && (
                        <Celebration etapaNombre={nombresEtapas[etapaCelebracion]}/>
                    )}
                </AnimatePresence>
                {isSaving && <IndicadorGuardando/>}

                {/* --- ÁREA PRINCIPAL (PLANTA) --- */}
                {/* MODIFICADO: order-1 en móvil (arriba), order-2 en escritorio (derecha) */}
                <main className="w-full md:w-4/5 flex flex-col gap-4 relative order-1 md:order-2 flex-grow h-full">
                    {/* Notificación Flotante */}
                    <AnimatePresence>
                        {notificacionClima && (
                            <motion.div
                                initial={{opacity: 0, y: -50, x: "-50%"}}
                                animate={{opacity: 1, y: 20, x: "-50%"}}
                                exit={{opacity: 0, y: -50, x: "-50%"}}
                                className="absolute top-0 left-1/2 z-50 bg-white/95 text-slate-800 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl border-4 border-blue-300 font-bold text-sm md:text-lg flex items-center gap-2 whitespace-nowrap"
                            >
                <span className="text-2xl md:text-3xl">
                  {currentWeatherInfo.emoji}
                </span>
                                {notificacionClima}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header del Huerto */}
                    <div
                        className="bg-gray-800/50 p-2 md:p-4 rounded-xl flex justify-between items-center backdrop-blur-sm shadow-lg">
                        <div>
                            <h2 className="text-sm md:text-xl font-bold">
                                {/* Texto responsivo */}
                                <span className="hidden md:inline">Etapa {etapa}: </span>
                                {nombresEtapas[etapa]}
                            </h2>

                            <div
                                className="flex items-center gap-2 text-xs md:text-sm text-blue-200 mt-1 bg-black/20 px-2 md:px-3 py-1 rounded-lg w-fit">
                                <span className="hidden md:inline">Clima:</span>
                                <span className="text-lg md:text-xl">
                  {currentWeatherInfo.emoji}
                </span>
                                <span className="font-semibold text-white">
                  {currentWeatherInfo.name}
                </span>
                            </div>
                        </div>

                        <button
                            onClick={reiniciarHuerto}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded font-bold shadow-md transition-colors"
                        >
                            Reiniciar
                        </button>
                    </div>

                    {/* Zona de Drop (La planta) */}
                    <div
                        ref={setNodeRef}
                        className={`flex-grow rounded-xl flex flex-col items-center justify-end pb-4 md:pb-8 p-4 transition-colors duration-300 relative ${
                            isOver ? "bg-green-500/30" : ""
                        }`}
                    >
                        {/* Ajustamos la escala de la planta en móviles para que quepa bien */}
                        <div className="transform scale-90 md:scale-100 origin-bottom">
                            <Planta etapa={etapa} agua={agua} sol={sol}/>
                        </div>

                        <div className="w-full md:w-1/2 mt-2 space-y-2 z-20">
                            <Medidor nivel={agua} tipo="agua"/>
                            <Medidor
                                nivel={sol}
                                tipo="sol"
                                respuestasCorrectas={respuestasCorrectas}
                                totalPreguntas={totalPreguntasEtapa}
                            />
                        </div>
                    </div>
                </main>

                {/* --- ESTANTE DE HERRAMIENTAS --- */}
                {/* MODIFICADO:
            - order-2 en móvil (abajo), order-1 en escritorio (izquierda).
            - Ancho completo en móvil, 1/5 en escritorio.
            - Fila (row) en móvil, Columna (col) en escritorio.
        */}
                <aside
                    className="w-full md:w-1/5 flex flex-row md:flex-col items-center justify-center gap-4 md:gap-6 relative z-30 order-2 md:order-1 mt-0 md:mt-4 p-2 md:p-0 bg-transparent">
                    {/* Fondo del tablón adaptable */}
                    <div
                        className="absolute inset-0 bg-[#8B4513] rounded-lg shadow-2xl border-4 border-[#5D2906]"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.2) 100%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px)",
                        }}
                    >
                        {/* Clavos decorativos (4 esquinas) */}
                        <div
                            className="absolute top-2 left-2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
                        <div
                            className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
                        <div
                            className="absolute bottom-2 left-2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
                        <div
                            className="absolute bottom-2 right-2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
                    </div>

                    {/* Título: Oculto en móvil para ahorrar espacio */}
                    <h3 className="hidden md:block text-lg font-bold text-[#FFD700] drop-shadow-md z-10 mt-3 font-serif tracking-wider bg-[#5D2906]/80 px-4 py-1 rounded-full border border-[#8B4513]">
                        HERRAMIENTAS
                    </h3>

                    {/* Contenedor de items: Fila en móvil, Columna en escritorio */}
                    <div
                        className="flex flex-row md:flex-col gap-8 md:gap-6 w-full items-center justify-center py-2 md:pb-6 z-10">
                        {["agua", "sol"].map((toolId) => (
                            <div key={toolId} className="relative group">
                                {/* Gancho visual (adaptado para ambos modos) */}
                                <div
                                    className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 w-2 h-3 md:h-4 bg-gray-400 rounded-full shadow-md z-0"></div>

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
                                    <div
                                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 md:left-full md:top-0 md:ml-4 md:translate-x-0 w-40 z-50">
                                        <TutorialBubble
                                            texto="¡Arrástrame a la planta!"
                                            direccionFlecha="abajo" // En móvil la burbuja sale arriba del ícono
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>

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