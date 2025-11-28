// frontend/src/components/Vocabulario/components/StartScreen.jsx
import React, { useState } from "react";
import { initAudio } from "../services/ttsService";
import VocabularioTeacherPanel from "./VocabularioTeacherPanel";

const StartScreen = ({
  startGame,
  settings,
  setSettings,
  onHelp,
}) => {
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);

  const handleStartClick = () => {
    initAudio();
    startGame();
  };

  const categories = [
    "Todas", "Animales", "Comida", "Naturaleza",
    "Objetos", "Ropa", "Cuerpo", "Transporte",
    "Personajes", "Instrumentos"
  ];

  return (
    <>
      <VocabularioTeacherPanel
        isOpen={showTeacherPanel}
        onClose={() => setShowTeacherPanel(false)}
      />

      {/* Contenedor principal: Centrado y con padding seguro */}
      <div className="w-full h-full flex items-center justify-center p-2 md:p-4">

        {/* Tarjeta: Altura ajustada para evitar scroll (max-h-[90vh]) */}
        <div className="card w-full max-w-5xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden border-4 border-white">

          {/* Encabezado Compacto */}
          <div className="bg-blue-500 py-4 px-6 text-center relative shrink-0 shadow-md z-10">
            <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-md tracking-wide">
              Juego de Vocabulario
            </h1>
            <p className="text-blue-100 text-sm md:text-lg mt-1 font-medium">
              ¡Aprende nuevas palabras jugando!
            </p>

            <button
              onClick={() => setShowTeacherPanel(true)}
              className="absolute top-4 right-4 text-blue-200 hover:text-white text-2xl transition-colors bg-blue-600/50 p-2 rounded-full hover:bg-blue-600"
              title="Panel de Maestro"
            >
              ⚙️
            </button>
          </div>

          {/* Cuerpo Flexible: Se ajusta al espacio restante */}
          <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">

            <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 md:gap-6 justify-center h-full">

              {/* Grid de Opciones (Categoría y Dificultad lado a lado en PC) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                {/* Categoría */}
                <div className="text-left flex flex-col justify-center">
                  <label className="block text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📂</span> Categoría
                  </label>
                  <select
                    value={settings.category || "Todas"}
                    onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-bold text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Dificultad */}
                <div className="text-left">
                  <label className="block text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>⚡</span> Dificultad
                  </label>
                  <div className="flex gap-2 h-[50px] md:h-[60px]">
                    {["easy", "medium", "hard"].map((level) => (
                      <label
                        key={level}
                        className={`flex-1 cursor-pointer rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center px-1
                          ${settings.difficulty === level
                            ? `bg-${level === "easy" ? "green" : level === "medium" ? "yellow" : "red"}-100 border-${level === "easy" ? "green" : level === "medium" ? "yellow" : "red"}-500 shadow-md transform -translate-y-1`
                            : "bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          value={level}
                          checked={settings.difficulty === level}
                          onChange={(e) => setSettings((prev) => ({ ...prev, difficulty: e.target.value }))}
                          className="sr-only"
                        />
                        <span className={`text-xs md:text-sm font-black uppercase tracking-wide ${
                             settings.difficulty === level ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            {level === "easy" ? "Fácil" : level === "medium" ? "Medio" : "Difícil"}
                          </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Switch Timer (Más compacto) */}
              <div
                className="bg-blue-50 p-3 rounded-xl border-2 border-blue-100 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors shadow-sm group"
                onClick={() => setSettings(prev => ({...prev, timerEnabled: !prev.timerEnabled}))}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">⏳</span>
                  <div>
                    <span className="block text-base font-bold text-blue-900">Jugar contra reloj</span>
                    <span className="text-xs text-blue-600 font-medium">¿Te atreves con el tiempo límite?</span>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${settings.timerEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${settings.timerEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              {/* Botón Jugar */}
              <button
                onClick={handleStartClick}
                className="group relative w-full bg-gradient-to-b from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black py-4 md:py-5 px-6 rounded-2xl shadow-lg text-2xl md:text-4xl transition-all transform hover:scale-[1.01] active:scale-95 active:shadow-inner mt-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🚀</span> ¡COMENZAR!
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <div className="text-center">
                 <button
                  onClick={onHelp}
                  className="text-gray-400 hover:text-blue-500 font-bold text-sm underline decoration-2 underline-offset-4 transition-colors"
                >
                  ¿Cómo se juega?
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartScreen;