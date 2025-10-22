// client/src/components/HuertoVirtual/components/HuertoBienvenida.jsx

import React from "react";
import PropTypes from "prop-types";

// Icono para el botón de inicio
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

function HuertoBienvenida({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-8 animate-fadeIn">
      <style>{`
        .start-button {
            animation: pulse 2.5s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <img
        src="https://placehold.co/400x300/c7d2fe/4338ca?text=Huerto+Virtual"
        alt="Ilustración de bienvenida al huerto"
        className="w-64 h-auto md:w-80 mb-6 rounded-2xl shadow-lg"
      />
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        ¡Bienvenido a tu Huerto!
      </h2>
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-8">
        Aquí podrás plantar, cuidar y ver crecer tus propias verduras virtuales.
        ¡Prepárate para cultivar y aprender!
      </p>
      <button
        onClick={onStart}
        className="start-button bg-green-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 duration-300 text-2xl flex items-center gap-3"
      >
        <PlayIcon />
        Iniciar Juego
      </button>
    </div>
  );
}

// Buena práctica: definir los prop types
HuertoBienvenida.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default HuertoBienvenida;
