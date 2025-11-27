// frontend/src/components/HuertoVirtual/components/HuertoBienvenida.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import TeacherPanel from "./TeacherPanel";
import StudentSelector from "./StudentSelector";

function HuertoBienvenida({ onStart }) {
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  const [showStudentSelector, setShowStudentSelector] = useState(false);

  const handleStudentSelect = (alumno) => {
    // Guardamos el ID del alumno en la sesión para que el juego lo use
    sessionStorage.setItem("current_student_id", alumno.id);
    sessionStorage.setItem("current_student_name", alumno.nombre);
    setShowStudentSelector(false);
    onStart(); // Inicia el juego
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
      {/* Botón Maestro */}
      <button
        onClick={() => setShowTeacherPanel(true)}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full shadow-lg transition-all z-50 group"
        title="Panel de Maestro"
      >
        <span className="text-2xl group-hover:scale-110 block transition-transform">⚙️</span>
      </button>

      {/* Paneles Modales */}
      <TeacherPanel
        isOpen={showTeacherPanel}
        onClose={() => setShowTeacherPanel(false)}
      />

      {showStudentSelector && (
        <StudentSelector
            onSelect={handleStudentSelect}
            onCancel={() => setShowStudentSelector(false)}
        />
      )}

      <style>{`
        .start-button { animation: pulse 2.5s infinite; }
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>

      <img
        src="https://placehold.co/400x300/c7d2fe/4338ca?text=Huerto+Virtual"
        alt="Ilustración de bienvenida"
        className="w-64 h-auto md:w-80 mb-6 rounded-2xl shadow-lg"
      />
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        ¡Bienvenido a tu Huerto!
      </h2>
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-8">
        Aquí podrás plantar, cuidar y ver crecer tus propias verduras virtuales.
      </p>

      <button
        onClick={() => setShowStudentSelector(true)}
        className="start-button bg-green-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 duration-300 text-2xl flex items-center gap-3"
      >
        <span className="text-2xl" role="img" aria-label="Play">▶️</span>
        Jugar (Elegir Alumno)
      </button>
    </div>
  );
}

HuertoBienvenida.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default HuertoBienvenida;