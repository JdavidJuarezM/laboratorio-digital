// src/components/Vocabulario/components/StartScreen.jsx
// src/components/Vocabulario/components/StartScreen.jsx

import React from "react";
import { initAudio } from "../services/ttsService";

const StartScreen = ({
  startGame,
  settings,
  setSettings,
  highScore,
  onHelp,
}) => {
  const handleStartClick = () => {
    initAudio(); // Asegura que el audio se inicie con el primer clic del usuario
    startGame();
  };

  return (
    <div className="card p-4 xs:p-6 sm:p-8 w-full max-w-md sm:max-w-lg text-center border-purple-500 bg-white rounded-2xl shadow-xl flex flex-col">
      <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-blue-800 mb-2 sm:mb-4 drop-shadow-lg">
        Juego de Vocabulario
      </h1>
      <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
        ¡Aprende nuevas palabras de forma divertida!
      </p>

      {/* --- SECCIÓN DE ENTRADA DE NOMBRE --- */}
      <div className="w-full text-left mb-4 sm:mb-6">
        <label
          htmlFor="player-name"
          className="block text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2"
        >
          Tu nombre:
        </label>
        <input
          type="text"
          id="player-name"
          placeholder="Escribe tu nombre aquí"
          value={settings.playerName}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, playerName: e.target.value }))
          }
          className="w-full p-2 sm:p-3 text-base sm:text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* --- SECCIÓN DE DIFICULTAD --- */}
      <div className="w-full text-left mb-4 sm:mb-8">
        <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
          Selecciona la dificultad:
        </label>
        <div className="flex flex-wrap justify-around gap-2 sm:gap-3">
          {["easy", "medium", "hard"].map((level) => (
            <label
              key={level}
              className={`flex-1 min-w-[80px] sm:min-w-[100px] flex items-center justify-center cursor-pointer p-2 sm:p-3 rounded-xl border-2 transition-all duration-200
                                        ${
                                          settings.difficulty === level
                                            ? `bg-${
                                                level === "easy"
                                                  ? "green"
                                                  : level === "medium"
                                                  ? "yellow"
                                                  : "red"
                                              }-100 border-${
                                                level === "easy"
                                                  ? "green"
                                                  : level === "medium"
                                                  ? "yellow"
                                                  : "red"
                                              }-500 shadow-md`
                                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                                        }`}
            >
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={settings.difficulty === level}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
                className="sr-only"
              />
              <span
                className={`text-base sm:text-lg font-bold ${
                  settings.difficulty === level
                    ? `text-${
                        level === "easy"
                          ? "green"
                          : level === "medium"
                          ? "yellow"
                          : "red"
                      }-700`
                    : "text-gray-600"
                }`}
              >
                {level === "easy"
                  ? "Fácil"
                  : level === "medium"
                  ? "Normal"
                  : "Difícil"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* --- INTERRUPTOR DE TEMPORIZADOR --- */}
      <div className="w-full text-left mb-4 sm:mb-8 flex justify-between items-center bg-gray-100 p-3 sm:p-4 rounded-xl border-2 border-gray-300">
        <span className="text-base sm:text-lg font-semibold text-gray-700">
          Activar Temporizador
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.timerEnabled}
            onChange={() =>
              setSettings((prev) => ({
                ...prev,
                timerEnabled: !prev.timerEnabled,
              }))
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* --- SECCIÓN DE PUNTUACIÓN MÁXIMA (SIN NOMBRE) --- */}
      <div className="w-full mb-4 sm:mb-8 text-center bg-gray-100 p-3 sm:p-4 rounded-xl border-2 border-gray-300">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-1 sm:mb-2">
          Mejor Puntuación
        </h2>
        <p className="text-xl xs:text-2xl text-purple-600 font-extrabold mb-0.5 sm:mb-1">
          Puntos: {highScore.score}
        </p>
        <p className="text-base sm:text-lg text-indigo-600 font-semibold mb-0.5 sm:mb-1">
          Racha: {highScore.streak}
        </p>
        {/* Aquí eliminé el bloque que mostraba (highScore.player) */}
      </div>

      {/* --- BOTONES DE ACCIÓN --- */}
      <div className="flex-grow"></div>
      <button
        onClick={handleStartClick}
        className="button bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg text-lg sm:text-2xl w-full transition-transform transform hover:scale-105"
      >
        ¡Jugar ahora!
      </button>
      <button
        onClick={onHelp}
        className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-500 hover:text-blue-700 font-semibold transition"
      >
        ¿Cómo se juega?
      </button>
    </div>
  );
};

export default StartScreen;