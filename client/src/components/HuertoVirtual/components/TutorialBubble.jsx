// client/src/components/HuertoVirtual/components/TutorialBubble.jsx

import React, { memo } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import clsx from "clsx";

const TutorialBubble = memo(
  ({ texto, posicion, direccionFlecha = "arriba" }) => {
    // Clases dinámicas para la flecha usando la librería 'clsx'
    const clasesFlecha = clsx("absolute left-1/2 -translate-x-1/2 w-0 h-0", {
      // Si la flecha apunta hacia ARRIBA (la burbuja está ABAJO)
      "-top-2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white":
        direccionFlecha === "arriba",
      // Si la flecha apunta hacia ABAJO (la burbuja está ARRIBA)
      "-bottom-2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white":
        direccionFlecha === "abajo",
    });

    return (
      <motion.div
        className={`absolute ${posicion} w-48 p-3 bg-white text-gray-800 rounded-lg shadow-xl z-50`}
        initial={{ opacity: 0, y: direccionFlecha === "arriba" ? 10 : -10 }} // Animación depende de la dirección
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <p className="text-sm font-semibold text-center">{texto}</p>

        {/* Flecha de la burbuja con clases dinámicas */}
        <div className={clasesFlecha}></div>
      </motion.div>
    );
  }
);

TutorialBubble.propTypes = {
  texto: PropTypes.string.isRequired,
  posicion: PropTypes.string.isRequired,
  direccionFlecha: PropTypes.oneOf(["arriba", "abajo"]),
};

export default TutorialBubble;
