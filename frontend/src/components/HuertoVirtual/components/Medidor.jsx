// client/src/components/HuertoVirtual/components/Medidor.jsx

import React, { memo } from "react";
import PropTypes from "prop-types";

const Medidor = memo(({ nivel, tipo, respuestasCorrectas }) => {
  const colores = { agua: "bg-blue-500", sol: "bg-yellow-400" };

  return (
    <div className="w-full">
      <div className="bg-gray-700 h-4 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${
            colores[tipo] || "bg-gray-400"
          } transition-all duration-300 ease-out`}
          style={{ width: `${nivel}%` }}
        />
      </div>

      {respuestasCorrectas !== undefined && (
        <div className="text-center text-sm text-white mt-1">
          Respuestas correctas: {respuestasCorrectas} / 3
        </div>
      )}
    </div>
  );
});

Medidor.propTypes = {
  nivel: PropTypes.number.isRequired,
  tipo: PropTypes.oneOf(["agua", "sol"]).isRequired,
  respuestasCorrectas: PropTypes.number,
};

// Nombre del componente para facilitar la depuración en las React DevTools
Medidor.displayName = "Medidor";

export default Medidor;
