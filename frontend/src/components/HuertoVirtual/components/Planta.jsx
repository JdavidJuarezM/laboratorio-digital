// client/src/components/HuertoVirtual/components/Planta.jsx

import React, {memo, useMemo} from "react";
import {motion, AnimatePresence} from "framer-motion";
import PropTypes from "prop-types";

// --- CONFIGURACIÓN BASE ---
// Usamos colores más vivos y degradados en las clases
const configEtapas = {
    0: {stemH: 0, flower: false, colorClass: "from-green-400 to-green-600"},
    1: {stemH: 60, flower: false, colorClass: "from-green-400 to-green-600"},
    2: {stemH: 80, flower: false, colorClass: "from-green-500 to-green-700"},
    3: {stemH: 110, flower: true, colorClass: "from-green-600 to-green-800"},
    4: {stemH: 125, flower: true, colorClass: "from-green-700 to-green-900", final: true},
};

const configHojas = [
    {apareceEnEtapa: 1, bottom: 25, duracionAnim: 2.5, scale: 0.8},
    {apareceEnEtapa: 2, bottom: 55, duracionAnim: 3.0, scale: 1},
    {apareceEnEtapa: 3, bottom: 85, duracionAnim: 3.2, scale: 0.9}, // Un par extra para más frondosidad
];

// --- SUB-COMPONENTES ---

const Hoja = ({rotate, colorClass, isWilted}) => (
    <motion.div
        className={`absolute bottom-0 w-12 h-6 bg-gradient-to-br ${colorClass} rounded-tr-[50px] rounded-bl-[50px] shadow-sm origin-bottom-left`}
        style={{
            border: '1px solid rgba(0,0,0,0.05)'
        }}
        animate={{
            rotate: rotate,
            scale: isWilted ? 0.9 : 1,
        }}
        transition={{duration: 1}}
    >
        {/* Detalle: Nervadura de la hoja */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20"/>
    </motion.div>
);

const ParDeHojas = memo(({colorClass, bottom, duracionAnim, delay, estadoSalud, scale = 1}) => {
    const isWilted = estadoSalud === "sedienta" || estadoSalud === "critica";

    // Ángulos más naturales
    const rotRight = isWilted ? 10 : -35;
    const rotLeft = isWilted ? 170 : 215; // 215 es el espejo de -35 aprox en este sistema de coordenadas

    return (
        <motion.div
            className="absolute left-1/2"
            style={{bottom: `${bottom}px`, width: 0, height: 0}} // Contenedor de punto cero
            initial={{opacity: 0, scale: 0}}
            animate={{
                opacity: 1,
                scale: scale,
                y: isWilted ? 10 : [0, -3, 0] // Flotación suave si está sana
            }}
            exit={{opacity: 0, scale: 0}}
            transition={{
                opacity: {delay},
                scale: {delay, type: "spring"},
                y: {duration: duracionAnim, repeat: Infinity, ease: "easeInOut", delay},
            }}
        >
            {/* Hoja Derecha */}
            <div className="absolute left-0 bottom-0">
                <Hoja rotate={rotRight} colorClass={colorClass} isWilted={isWilted}/>
            </div>

            {/* Hoja Izquierda (usamos scale-x-[-1] para espejear la forma de hoja) */}
            <div className="absolute right-0 bottom-0 transform -scale-x-100">
                <Hoja rotate={rotRight} colorClass={colorClass} isWilted={isWilted}/>
            </div>
        </motion.div>
    );
});

ParDeHojas.propTypes = {
    colorClass: PropTypes.string.isRequired,
    bottom: PropTypes.number.isRequired,
    duracionAnim: PropTypes.number.isRequired,
    delay: PropTypes.number.isRequired,
    estadoSalud: PropTypes.string.isRequired,
    scale: PropTypes.number,
};

const Flor = memo(({stemHeightPx, isFinal, estadoSalud}) => {
    const isWilted = estadoSalud === "sedienta" || estadoSalud === "critica";

    return (
        <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-20 h-20 origin-bottom"
            style={{bottom: `${stemHeightPx - 5}px`}} // Ajuste para que nazca del tallo
            initial={{scale: 0}}
            animate={{
                scale: isWilted ? 0.7 : 1,
                rotate: isWilted ? 25 : 0
            }}
            transition={{type: "spring", stiffness: 150, damping: 10}}
        >
            {/* Centro de la flor con degradado */}
            <div
                className={`absolute top-11 left-1 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 shadow-inner ${
                    isWilted ? 'bg-amber-700' : 'bg-gradient-to-br from-yellow-300 to-amber-500'
                }`}/>

            {/* Pétalos */}
            {[0, 60, 120, 180, 240, 300].map((rot) => (
                <motion.div
                    key={rot}
                    className={`absolute bottom-9 -left-2  w-6 h-10 -translate-x-3/4 -translate-y-full origin-bottom rounded-full shadow-sm ${
                        isWilted ? 'bg-pink-900' : 'bg-gradient-to-t from-pink-500 to-pink-300'
                    }`}
                    style={{rotate: `${rot}deg`}}
                    animate={{
                        scaleY: isFinal && !isWilted ? [1, 1.1, 1] : 1
                    }}
                    transition={{duration: 2, repeat: Infinity}}
                />
            ))}
        </motion.div>
    );
});

Flor.propTypes = {
    stemHeightPx: PropTypes.number.isRequired,
    isFinal: PropTypes.bool,
    estadoSalud: PropTypes.string.isRequired,
};

// --- COMPONENTE PRINCIPAL "PLANTA" ---
const Planta = memo(({etapa, agua, sol}) => {
    const currentStage = configEtapas[etapa] || configEtapas[4];

    // Lógica de salud
    const estadoSalud = useMemo(() => {
        if (agua < 30 && sol < 30) return "critica";
        if (agua < 30) return "sedienta";
        if (sol < 30) return "sin-luz";
        return "sana";
    }, [agua, sol]);

    // Color dinámico del tallo
    let stemColorClass = currentStage.colorClass;
    if (estadoSalud === "sedienta") stemColorClass = "from-amber-600 to-amber-800";
    else if (estadoSalud === "sin-luz") stemColorClass = "from-green-800 to-green-950";
    else if (estadoSalud === "critica") stemColorClass = "from-red-800 to-brown-900";

    return (
        // CAMBIO: Eliminamos 'h-80' y usamos 'absolute' para posicionarla exactamente donde queramos
        // Ajusta 'bottom-xx' según sea necesario para que toque la tierra visualmente.
        <div className="relative w-48 h-64 flex flex-col items-center justify-end mb-8">

            {/* === MACETA PREMIUM === */}
            <div className="relative z-10 w-32">

                {/* Planta (Tallo y Hojas) */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full flex justify-center z-0">
                    {/* Tallo */}
                    <motion.div
                        className={`w-4 rounded-full origin-bottom absolute bottom-0 bg-gradient-to-r ${stemColorClass} shadow-md`}
                        initial={{height: 0}}
                        animate={{
                            height: currentStage.stemH,
                            rotate: estadoSalud === 'sana' ? [0, -1, 1, 0] : 2
                        }}
                        transition={{duration: 3, ease: "easeInOut", repeat: Infinity}}
                    />

                    <AnimatePresence>
                        {configHojas
                            .filter((hoja) => etapa >= hoja.apareceEnEtapa)
                            .map((hoja, index) => (
                                <ParDeHojas
                                    key={index}
                                    colorClass={stemColorClass}
                                    bottom={hoja.bottom}
                                    duracionAnim={hoja.duracionAnim}
                                    delay={index * 0.3}
                                    estadoSalud={estadoSalud}
                                    scale={hoja.scale}
                                />
                            ))}
                    </AnimatePresence>

                    <AnimatePresence>
                        {currentStage.flower && (
                            <Flor
                                stemHeightPx={currentStage.stemH}
                                isFinal={currentStage.final}
                                estadoSalud={estadoSalud}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Cuerpo de la Maceta */}
                <div
                    className="h-24 w-full bg-gradient-to-r from-orange-800 via-orange-600 to-orange-800 rounded-b-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-4 w-4 h-full bg-white/10 blur-md transform skew-x-12"/>
                </div>

                {/* Borde Superior de la Maceta */}
                <div
                    className="absolute -top-4 w-[110%] -left-[5%] h-8 bg-gradient-to-r from-orange-900 via-orange-700 to-orange-900 rounded-lg shadow-md flex items-center justify-center">
                    <div className="w-[90%] h-4 bg-stone-800 rounded-full mt-1 opacity-90 shadow-inner"/>
                </div>

                {/* Sombra en el suelo (Aumentamos opacidad para que se note el contacto) */}
                <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-black/40 blur-md rounded-[100%]"/>

                {/* Etiqueta de Alerta */}
                <AnimatePresence>
                    {estadoSalud !== "sana" && (
                        <motion.div
                            initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}}
                            className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-1 rounded-full text-sm font-bold text-red-600 shadow-lg border border-red-200 whitespace-nowrap z-20 flex items-center gap-1"
                        >
                            <span className="animate-pulse">⚠️</span>
                            {estadoSalud === "sedienta" && "¡Agua!"}
                            {estadoSalud === "sin-luz" && "¡Sol!"}
                            {estadoSalud === "critica" && "¡Ayuda!"}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
});

Planta.propTypes = {
    etapa: PropTypes.number.isRequired,
    agua: PropTypes.number.isRequired,
    sol: PropTypes.number.isRequired,
};

export default Planta;