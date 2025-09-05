// src/components/Vocabulario/components/StartScreen.jsx

import React from "react";
import { initAudio } from "../services/ttsService"; // <-- 1. IMPORTACIÓN AÑADIDA

const StartScreen = ({
  startGame,
  settings,
  setSettings,
  highScore,
  onHelp,
}) => {
  // 2. FUNCIÓN CORRECTA PARA EL BOTÓN DE INICIO
  const handleStartClick = () => {
    console.log(
      "Botón '¡Jugar ahora!' ha sido presionado. Llamando a startGame..."
    );
    startGame();
  };

  return (
    <div className="card p-8 w-full max-w-xl text-center border-purple-500">
      <h1 className="text-5xl font-bold text-blue-800 mb-4 drop-shadow-lg">
        Juego de Vocabulario
      </h1>
      <p className="text-xl text-gray-700 mb-6">
        ¡Aprende nuevas palabras de forma divertida!
      </p>

      <div className="w-full text-left mb-6">
        <label
          htmlFor="player-name"
          className="block text-lg font-semibold text-gray-700 mb-2"
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
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="w-full text-left mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          Selecciona la dificultad:
        </label>
        <div className="flex flex-col sm:flex-row justify-around gap-4">
          {["easy", "medium", "hard"].map((level) => (
            <label
              key={level}
              className={`flex items-center cursor-pointer p-3 rounded-xl border-2 bg-${
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
              }-500 hover:bg-${
                level === "easy"
                  ? "green"
                  : level === "medium"
                  ? "yellow"
                  : "red"
              }-200 transition`}
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
                className={`mr-2 accent-${
                  level === "easy"
                    ? "green"
                    : level === "medium"
                    ? "yellow"
                    : "red"
                }-500`}
              />
              <span
                className={`text-lg font-bold text-${
                  level === "easy"
                    ? "green"
                    : level === "medium"
                    ? "yellow"
                    : "red"
                }-700 capitalize`}
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

      <div className="w-full text-left mb-8 flex justify-between items-center bg-gray-100 p-4 rounded-xl border-2 border-gray-300">
        <span className="text-lg font-semibold text-gray-700">
          Activar Temporizador
        </span>
        <label className="switch-container">
          <input
            type="checkbox"
            checked={settings.timerEnabled}
            onChange={() =>
              setSettings((prev) => ({
                ...prev,
                timerEnabled: !prev.timerEnabled,
              }))
            }
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="w-full mb-8 text-center bg-gray-100 p-4 rounded-xl border-2 border-gray-300">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Mejor Puntuación
        </h2>
        <p className="text-2xl text-purple-600 font-extrabold mb-1">
          Puntos: {highScore.score}
        </p>
        <p className="text-lg text-indigo-600 font-semibold mb-1">
          Racha: {highScore.streak}
        </p>
        {highScore.player && (
          <p className="text-sm text-gray-500 mt-2 italic">
            ({highScore.player})
          </p>
        )}
      </div>

      <button
        onClick={handleStartClick} // <-- 3. ASIGNACIÓN CORRECTA
        className="button bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full shadow-lg text-2xl"
      >
        ¡Jugar ahora!
      </button>
      <button
        onClick={onHelp}
        className="mt-4 text-blue-500 hover:text-blue-700 font-semibold transition"
      >
        ¿Cómo se juega?
      </button>
    </div>
  );
};

export default StartScreen;
