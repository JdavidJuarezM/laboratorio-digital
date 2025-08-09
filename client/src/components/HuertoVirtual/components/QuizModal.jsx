import React, { useState } from "react";
import { motion } from "framer-motion";

const QuizModal = ({ pregunta, onRespuesta }) => {
  const [feedback, setFeedback] = useState("");

  const handleOpcionClick = (opcion) => {
    const esCorrecta = opcion === pregunta.correcta;
    setFeedback(esCorrecta ? "¡Correcto!" : "Inténtalo de nuevo");

    setTimeout(() => {
      onRespuesta(esCorrecta);
      setFeedback(""); // Limpiar feedback para la próxima pregunta
    }, 1500); // Espera 1.5 segundos para que el usuario vea el feedback
  };

  return (
    <motion.div
      className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center"
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          {pregunta.pregunta}
        </h2>
        <div className="grid grid-cols-1 gap-3 my-6">
          {pregunta.opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => handleOpcionClick(opcion)}
              disabled={!!feedback} // Deshabilita botones después de responder
              className="bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {opcion}
            </button>
          ))}
        </div>

        {feedback && (
          <p
            className={`text-xl font-bold ${
              feedback === "¡Correcto!" ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuizModal;
