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
                <WeatherFX clima={clima}/>
                <AnimatePresence>
                    {etapaCelebracion !== null && (
                        <Celebration etapaNombre={nombresEtapas[etapaCelebracion]}/>
                    )}
                </AnimatePresence>
                {isSaving && <IndicadorGuardando/>}

                {/* --- ESTANTE DE HERRAMIENTAS DE MADERA --- */}
        <aside className="w-1/5 flex flex-col items-center gap-6 self-start mt-4 relative z-30">

          {/* Fondo del "tablón" */}
          <div className="absolute inset-0 bg-[#8B4513] rounded-lg shadow-2xl border-4 border-[#5D2906]"
               style={{
                 backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.2) 100%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px)'
               }}>
            {/* Clavos decorativos en las esquinas */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#4A2511] shadow-inner"></div>
          </div>

          <h3 className="text-lg font-bold text-[#FFD700] drop-shadow-md z-10 mt-3 font-serif tracking-wider bg-[#5D2906]/80 px-4 py-1 rounded-full border border-[#8B4513]">
            HERRAMIENTAS
          </h3>

          <div className="flex flex-col gap-6 w-full items-center pb-6 z-10">
            {["agua", "sol"].map((toolId) => (
              <div key={toolId} className="relative group">
                {/* Gancho donde cuelga la herramienta */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-gray-400 rounded-full shadow-md z-0"></div>

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
                  <div className="absolute left-full top-0 ml-4 w-40 z-50">
                     <TutorialBubble texto="¡Arrástrame a la planta!" direccionFlecha="izquierda" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
        {/* --- FIN DEL ESTANTE --- */}

                <main className="w-4/5 flex flex-col gap-4 relative">

                    {/* Notificación Flotante de Cambio de Clima */}
                    <AnimatePresence>
                        {notificacionClima && (
                            <motion.div
                                initial={{opacity: 0, y: -50, x: "-50%"}}
                                animate={{opacity: 1, y: 20, x: "-50%"}}
                                exit={{opacity: 0, y: -50, x: "-50%"}}
                                className="absolute top-0 left-1/2 z-50 bg-white/95 text-slate-800 px-6 py-3 rounded-full shadow-2xl border-4 border-blue-300 font-bold text-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                <span className="text-3xl">{currentWeatherInfo.emoji}</span>
                                {notificacionClima}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-gray-800/50 p-4 rounded-xl flex justify-between items-center backdrop-blur-sm">
                        <div>
                            <h2 className="text-xl font-bold">
                                Etapa {etapa}: {nombresEtapas[etapa]}
                            </h2>

                            {/* Indicador de Clima */}
                            <div
                                className="flex items-center gap-2 text-sm text-blue-200 mt-1 bg-black/20 px-3 py-1 rounded-lg w-fit">
                                <span>Clima actual:</span>
                                <span className="text-xl">{currentWeatherInfo.emoji}</span>
                                <span className="font-semibold text-white">{currentWeatherInfo.name}</span>
                            </div>
                        </div>

                        <button
                            onClick={reiniciarHuerto}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold shadow-md transition-colors"
                        >
                            Reiniciar
                        </button>
                    </div>

                    <div
                        ref={setNodeRef}
                        className={`flex-grow rounded-xl flex flex-col items-center justify-end pb-8 p-4 transition-colors duration-300 ${
                            isOver ? "bg-green-500/30" : ""
                        }`} // Ya no necesitamos las clases de clima aquí, WeatherFX lo hace mejor
                        style={{paddingBottom: '20px'}}
                    >
                        <Planta etapa={etapa} agua={agua} sol={sol}/>

                        {/* Las barras de progreso ahora tendrán un margen superior negativo para acercarse a la maceta si quedan muy lejos */}
                        <div className="w-1/2 mt-2 space-y-2 z-20">
                            <Medidor nivel={agua} tipo="agua"/>
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