// client/src/components/HuertoVirtual/components/Medidor.jsx
import React, { memo } from "react";
import PropTypes from "prop-types";

const Medidor = memo(({ nivel, tipo, respuestasCorrectas, totalPreguntas = 3 }) => { // Default 3
  const isAgua = tipo === "agua";

  const colorBarra = isAgua
    ? "bg-gradient-to-r from-blue-400 to-blue-600"
    : "bg-gradient-to-r from-yellow-300 to-amber-500";

  const icono = isAgua ? "💧" : "☀️";
  const titulo = isAgua ? "Hidratación" : "Energía Solar";

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between text-xs font-bold text-white mb-1 px-1 shadow-black drop-shadow-md">
        <span className="flex items-center gap-1">{icono} {titulo}</span>
        <span>{Math.round(nivel)}%</span>
      </div>

      <div className="relative h-6 bg-gray-900/50 rounded-full border-2 border-white/30 backdrop-blur-sm overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)' }}>
        </div>

        <div
          className={`h-full ${colorBarra} transition-all duration-500 ease-out relative`}
          style={{ width: `${nivel}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-[40%] bg-white/40 rounded-t-full"></div>
        </div>
      </div>

      {respuestasCorrectas !== undefined && (
        <div className="text-center text-xs font-bold text-white mt-1 bg-black/30 rounded-full py-0.5 inline-block px-3 mx-auto w-full backdrop-blur-md border border-white/10">
          {/* CAMBIO: Usamos totalPreguntas dinámico */}
          🧠 Aciertos para crecer: <span className="text-yellow-300">{respuestasCorrectas} / {totalPreguntas}</span>
        </div>
      )}
    </div>
  );
});

Medidor.propTypes = {
  nivel: PropTypes.number.isRequired,
  tipo: PropTypes.oneOf(["agua", "sol"]).isRequired,
  respuestasCorrectas: PropTypes.number,
  totalPreguntas: PropTypes.number, // Nueva prop
};

Medidor.displayName = "Medidor";

export default Medidor;