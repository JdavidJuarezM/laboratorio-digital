// src/components/DashboardWelcome/GameCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import soundService from "../../services/soundService";

const GameCard = ({ icon, title, description, buttonColor, linkTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    soundService.playClick();
    if (linkTo) {
      navigate(linkTo);
    } else {
      alert(`El juego "${title}" estará disponible próximamente.`);
    }
  };

  return (
    <div
      className="game-card bg-white/80 backdrop-blur-sm rounded-3xl p-6 text-center flex flex-col items-center shadow-lg cursor-pointer"
      onMouseEnter={soundService.playHover}
      onClick={handleClick} // Hacemos que toda la tarjeta sea clickeable
    >
      <div className="icon-container p-4 rounded-full mb-4 transition-transform pointer-events-none">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 pointer-events-none">
        {title}
      </h2>
      <p className="text-gray-600 mb-6 flex-grow pointer-events-none">
        {description}
      </p>
      <button
        className={`play-button ${buttonColor} text-white font-bold py-3 px-8 rounded-full shadow-lg w-full transition-colors pointer-events-none`}
      >
        Jugar
      </button>
    </div>
  );
};

export default GameCard;
