// client/src/components/HuertoVirtual/components/Celebration.jsx

import React, { memo } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import useWindowSize from "react-use/lib/useWindowSize";
import PropTypes from "prop-types";

const Celebration = memo(({ etapaNombre }) => {
  const { width, height } = useWindowSize();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
        gravity={0.1}
      />
      <motion.div
        className="text-center"
        initial={{ scale: 0, y: 100 }}
        animate={{
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 200, delay: 0.2 },
        }}
      >
        <h2
          className="text-2xl font-bold text-yellow-300"
          style={{ textShadow: "0px 2px 5px rgba(0,0,0,0.5)" }}
        >
          ¡Felicidades!
        </h2>
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-white mt-2"
          style={{ textShadow: "0px 4px 10px rgba(0,0,0,0.5)" }}
        >
          {/* Usamos el nombre de la etapa para un mensaje más claro */}
          Alcanzaste la etapa de <br /> "{etapaNombre}"
        </h1>
      </motion.div>
    </motion.div>
  );
});

Celebration.propTypes = {
  etapaNombre: PropTypes.string.isRequired,
};

export default Celebration;
