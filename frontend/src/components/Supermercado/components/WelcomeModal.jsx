// client/src/components/Supermercado/components/WelcomeModal.jsx
import React from "react";

const WelcomeModal = ({ onStart }) => {
  return (
    <div className="modal-base fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center transform transition-all bg-white border-2 border-gray-300 slide-in-up">
        <h2 className="text-3xl font-bold text-blue-700">¡Bienvenido al</h2>
        <h1 className="text-4xl font-black text-blue-700 mb-4">
          SuperMercado Matemático!
        </h1>
        <p className="text-gray-600 mb-6">
          ¿Listo para llenar tu carrito de conocimiento? ¡Resuelve los desafíos
          y conviértete en el mejor comprador!
        </p>
        <button
          className="btn w-full bg-green-500 text-white font-bold py-3 px-6 text-lg"
          onClick={onStart}
        >
          ¡Empezar a Comprar!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
