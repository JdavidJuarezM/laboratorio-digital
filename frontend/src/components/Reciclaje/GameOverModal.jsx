// frontend/src/components/Reciclaje/GameOverModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const GameOverModal = ({ score, highScore, stats, onRestart }) => {
  const { width, height } = useWindowSize();
  const isNewHighScore = score > highScore;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isNewHighScore && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={false}
          gravity={0.1}
        />
      )}
      <motion.div
        className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-blue-700 mb-4">
          {isNewHighScore ? `¡NUEVO RÉCORD: ${score}!` : '¡Juego Terminado!'}
        </h1>

        {!isNewHighScore && (
          <div className="text-4xl font-bold text-blue-600 mb-6">
            Puntuación Final: {score}
          </div>
        )}

        <div className="text-left text-lg text-gray-700 space-y-2 my-6 max-w-xs mx-auto">
          <div>♻️ <strong>Objetos Reciclados:</strong> <span className="font-bold text-gray-900">{stats.itemsCorrect}</span></div>
          <div>⚡ <strong>Poderes Usados:</strong> <span className="font-bold text-gray-900">{stats.powerUpsCollected}</span></div>
          <div>💣 <strong>Bombas Evitadas:</strong> <span className="font-bold text-gray-900">{stats.bombsAvoided}</span></div>
        </div>

        <button
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-2xl shadow-lg transition-transform transform hover:scale-105"
        >
          Jugar de Nuevo
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;