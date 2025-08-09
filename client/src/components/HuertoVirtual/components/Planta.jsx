import React, { memo } from "react"; // Importamos memo
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURACIÓN ---
// Datos para las etapas de la planta
const configEtapas = {
  0: { stemH: 0, flower: false, color: "bg-green-300" },
  1: { stemH: 60, flower: false, color: "bg-green-400" },
  2: { stemH: 80, flower: false, color: "bg-green-500" },
  3: { stemH: 110, flower: true, color: "bg-green-600" },
  4: { stemH: 125, flower: true, color: "bg-green-700", final: true },
};

// Datos para la aparición de las hojas, para no repetir código
const configHojas = [
  { apareceEnEtapa: 1, bottom: 25, duracionAnim: 2.0 },
  { apareceEnEtapa: 2, bottom: 55, duracionAnim: 2.5 },
  // Si quisieras un tercer par de hojas, solo añades un objeto aquí
  // { apareceEnEtapa: 3, bottom: 85, duracionAnim: 2.2 },
];

// --- SUB-COMPONENTE REUTILIZABLE PARA LAS HOJAS ---
const ParDeHojas = ({ color, bottom, duracionAnim, delay }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2"
    style={{ bottom: `${bottom}px` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: [0, -2, 0] }}
    exit={{ opacity: 0 }} // Para AnimatePresence
    transition={{
      opacity: { delay },
      y: { duration: duracionAnim, repeat: Infinity, ease: "easeInOut", delay },
    }}
  >
    {/* Hoja Izquierda */}
    <div
      className={`absolute bottom-0 right-1 w-10 h-5 rounded-full ${color}`}
      style={{ transform: "rotate(-40deg)" }}
    />
    {/* Hoja Derecha */}
    <div
      className={`absolute bottom-0 left-1 w-10 h-5 rounded-full ${color}`}
      style={{ transform: "rotate(40deg)" }}
    />
  </motion.div>
);

// --- SUB-COMPONENTE PARA LA FLOR ---
const Flor = ({ stemHeightPx, isFinal }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 w-16 h-16 origin-bottom"
    style={{ bottom: `${stemHeightPx}px` }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
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
        animate={{ rotate: rot, scale: isFinal ? [1, 1.2, 1] : 1 }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    ))}
  </motion.div>
);

// --- COMPONENTE PRINCIPAL "PLANTA" ---
// Ahora mucho más limpio y envuelto en React.memo
const Planta = memo(({ etapa }) => {
  const currentStage = configEtapas[etapa] || configEtapas[4];

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
          animate={{ height: currentStage.stemH, rotate: [0, -2, 2, -1, 1, 0] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Renderizado dinámico de las hojas */}
        <AnimatePresence>
          {configHojas
            .filter((hoja) => etapa >= hoja.apareceEnEtapa)
            .map((hoja, index) => (
              <ParDeHojas
                key={hoja.apareceEnEtapa}
                color={currentStage.color}
                bottom={hoja.bottom}
                duracionAnim={hoja.duracionAnim}
                delay={0.5 + index * 0.2} // Un pequeño delay escalonado
              />
            ))}
        </AnimatePresence>

        {/* Renderizado de la flor */}
        <AnimatePresence>
          {currentStage.flower && (
            <Flor
              stemHeightPx={currentStage.stemH}
              isFinal={currentStage.final}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default Planta;
