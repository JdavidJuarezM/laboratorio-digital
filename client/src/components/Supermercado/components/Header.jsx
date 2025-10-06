// client/src/components/Supermercado/components/Header.jsx
import React from "react";
import { playClickSound } from "../services/soundService";

const difficultyLabels = {
  easy: "Fácil",
  normal: "Normal",
  hard: "Difícil",
  extreme: "Extremo",
};

const Header = ({
  score,
  highScore,
  difficulty,
  dispatch,
  isBudgetMode,
  budgetRemaining,
  onRestart,
}) => {
  const handleDifficultyChange = (newDifficulty) => {
    if (difficulty === newDifficulty) return;
    playClickSound();
    dispatch({ type: "SET_DIFFICULTY", payload: newDifficulty });
    // Correctamente pasamos un objeto a onRestart
    onRestart({
      newDifficulty,
      newBudgetMode: isBudgetMode,
      forceRestart: true,
    });
  };

  const handleBudgetChange = (e) => {
    const newBudgetMode = e.target.checked;
    playClickSound();
    dispatch({ type: "SET_BUDGET_MODE", payload: newBudgetMode });
    // Correctamente pasamos un objeto a onRestart
    onRestart({ newDifficulty: difficulty, newBudgetMode, forceRestart: true });
  };

  return (
    <header className="text-center mb-4">
      <h1 className="text-4xl md:text-5xl font-black text-slate-800 flex justify-center items-center gap-4">
        <div id="mascot" className="text-5xl">
          🛒
        </div>
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

      <div
        id="difficulty-selector"
        className="flex justify-center gap-2 md:gap-4 flex-wrap my-6 md:my-8"
      >
        {Object.keys(difficultyLabels).map((level) => (
          <button
            key={level}
            className={`btn difficulty-btn py-2 px-4 md:py-3 md:px-6 
                            ${
                              level === "easy"
                                ? "bg-green-200 text-green-800"
                                : ""
                            }
                            ${
                              level === "normal"
                                ? "bg-blue-200 text-blue-800"
                                : ""
                            }
                            ${level === "hard" ? "bg-red-200 text-red-800" : ""}
                            ${
                              level === "extreme"
                                ? "bg-purple-200 text-purple-800"
                                : ""
                            }
                            ${difficulty === level ? "active" : ""}`}
            onClick={() => handleDifficultyChange(level)}
          >
            {difficultyLabels[level]}
          </button>
        ))}
      </div>

      <div id="budget-section" className="mt-4 text-center">
        <label
          htmlFor="budget-toggle"
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            checked={isBudgetMode}
            onChange={handleBudgetChange}
            id="budget-toggle"
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          <span className="ml-3 text-lg font-bold text-slate-700">
            Modo Presupuesto
          </span>
        </label>
        {isBudgetMode && (
          <div className="bg-green-100 text-green-800 font-bold py-2 px-5 rounded-xl text-lg border-2 border-green-300 mt-2 mx-auto max-w-xs">
            Restante: <span>${budgetRemaining.toFixed(2)}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
