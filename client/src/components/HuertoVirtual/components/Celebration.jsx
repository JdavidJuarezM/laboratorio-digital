import React from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import useWindowSize from "react-use/lib/useWindowSize"; // una librería útil para obtener el tamaño de la ventana

const Celebration = ({ etapa }) => {
  const { width, height } = useWindowSize();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }} // Desaparece lentamente
    >
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
      />
      <motion.h1
        className="text-5xl font-extrabold text-white"
        style={{ textShadow: "0px 4px 10px rgba(0,0,0,0.5)" }}
        initial={{ scale: 0, y: 100 }}
        animate={{
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 200, delay: 0.2 },
        }}
      >
        ¡ETAPA {etapa} COMPLETADA!
      </motion.h1>
    </motion.div>
  );
};

export default Celebration;
