// src/components/Vocabulario/components/EndModal.jsx

import React from "react";

const EndModal = ({gameStats, restartGame}) => {
    return (
        <div className="modal visible fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="card p-8 sm:p-12 text-center border-purple-500 w-full max-w-lg">
                <h2 className="text-4xl font-bold text-purple-600 mb-4">
                    ¡Juego Terminado!
                </h2>
                <p className="text-lg text-gray-800 mb-2">
                    ¡Felicidades, has completado tu sesión de juego!
                </p>
                <div className="flex flex-col items-center mt-6">
          <span className="text-3xl font-bold text-purple-700">
            Puntos: {gameStats.points}
          </span>
                    <span className="text-xl font-semibold text-indigo-500 mt-2">
            Racha más larga: {gameStats.longestStreak}
          </span>
                </div>
                <button
                    onClick={restartGame}
                    className="button bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-md mt-8"
                >
                    Jugar de nuevo
                </button>
            </div>
        </div>
    );
};

export default EndModal;
