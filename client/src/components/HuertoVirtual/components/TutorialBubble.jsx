import React from "react";
import { motion } from "framer-motion";

const TutorialBubble = ({ texto, posicion }) => {
  // 'posicion' puede ser 'top-full', 'right-full', etc. para ubicar la burbuja
  // relativa al elemento que queremos señalar.
  return (
    <motion.div
      className={`absolute ${posicion} w-48 p-3 bg-white text-gray-800 rounded-lg shadow-xl z-50`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm font-semibold">{texto}</p>
      {/* Flecha de la burbuja */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
    </motion.div>
  );
};

export default TutorialBubble;
