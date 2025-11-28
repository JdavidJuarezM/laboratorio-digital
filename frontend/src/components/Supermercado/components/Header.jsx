import React from "react";
import { playClickSound } from "../services/soundService";

const difficultyLabels = {
  easy: "Fácil",
  normal: "Normal",
  hard: "Difícil",
  extreme: "Extremo",
};

const Header = ({ score, highScore, difficulty, dispatch, onRestart }) => {
  const handleDifficultyChange = (newDifficulty) => {
    if (difficulty === newDifficulty) return;
    playClickSound();
    dispatch({ type: "SET_DIFFICULTY", payload: newDifficulty });
    onRestart({ newDifficulty, forceRestart: true });
  };

  return (
    <header className="text-center mb-4">
      <h1 className="text-4xl md:text-5xl font-black text-slate-800 flex justify-center items-center gap-4">
        <span className="text-5xl">🛒</span>
        SuperMercado Matemático
      </h1>
      <div className="flex justify-center items-center mt-4 space-x-2 md:space-x-4">
        <div className="bg-yellow-100 text-yellow-800 font-bold py-2 px-3 md:px-5 rounded-xl text-md md:text-lg border-2 border-yellow-300">
          Puntuación: <span>{score}</span>
        </div>
        <div className="bg-purple-100 text-purple-800 font-bold py-2 px-3 md:px-5 rounded-xl text-md md:text-lg border-2 border-purple-300">
          Récord: <span>{highScore}</span>
        </div>
      </div>

      <div className="flex justify-center gap-2 md:gap-4 flex-wrap my-6 md:my-8">
        {Object.keys(difficultyLabels).map((level) => (
          <button
            key={level}
            className={`btn py-2 px-4 md:py-3 md:px-6 transition-all
              ${level === "easy" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
              ${level === "normal" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
              ${level === "hard" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
              ${level === "extreme" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              ${difficulty === level ? "ring-4 ring-offset-2 ring-blue-300 transform scale-105 font-extrabold" : "opacity-80"}
            `}
            onClick={() => handleDifficultyChange(level)}
          >
            {difficultyLabels[level]}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;