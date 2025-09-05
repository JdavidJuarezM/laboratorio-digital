// src/components/Vocabulario/components/HelpModal.jsx

import React from "react";

const HelpModal = ({ onClose }) => {
  return (
    <div className="modal visible fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="card p-8 sm:p-12 text-center border-blue-500 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          ¿Cómo se juega?
        </h2>
        <div className="text-left">
          <p className="mb-4">
            El objetivo es adivinar la palabra oculta. Sigue estos pasos:
          </p>
          <ul className="list-disc list-inside">
            <li>1. Observa la imagen para tener una pista sobre la palabra.</li>
            <li>
              2. Usa los botones de las letras para completar los espacios en
              blanco.
            </li>
            <li>3. Completa la palabra antes de que el tiempo se acabe.</li>
          </ul>
          <h3 className="text-xl font-bold mt-6 mb-2">Puntos y Botones:</h3>
          <ul className="list-disc list-inside">
            <li>
              **Puntos:** Ganas puntos por cada palabra correcta. ¡Adivina
              rápidamente para ganar puntos extra!
            </li>
            <li>
              **Racha:** Adivinar palabras seguidas aumenta tu racha y te da más
              puntos.
            </li>
            <li>
              **Escuchar:** Haz clic para escuchar la pronunciación de la
              palabra.
            </li>
            <li>
              **Pista:** Revela una letra correcta, pero te costará 5 puntos.
            </li>
          </ul>
        </div>
        <button
          onClick={onClose}
          className="button bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md mt-8"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
