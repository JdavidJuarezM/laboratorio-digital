// frontend/src/components/Reciclaje/ScoreDisplay.jsx

import React from 'react';
import { playSound } from './soundService'; // Importamos el servicio de sonido del juego

// Componente para un solo corazón
const HeartIcon = ({ isLost }) => (
  <div className={`life-heart ${isLost ? 'lost' : ''}`}>
    <svg viewBox="0 0 24 24">
      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
    </svg>
  </div>
);

const ScoreDisplay = ({
  score,
  highScore,
  lives,
  level,
  streak,
  onPause,
  onMute,
  isMuted,
  isFeverMode,
  isDoublePoints,
  powerUpTimeLeft,
}) => {
  // Genera los corazones de vida
  const hearts = [...Array(3)].map((_, i) => (
    <HeartIcon key={i} isLost={i >= lives} />
  ));

  // Clases dinámicas para la racha y puntos
  const streakClasses = `p-2 bg-lime-100 rounded-lg shadow-inner ${isFeverMode ? 'fever-mode-streak' : ''}`;
  const scoreClasses = `p-2 bg-blue-100 rounded-lg shadow-inner ${isDoublePoints ? 'double-points-active' : ''}`;

  const handlePauseClick = () => {
    playSound('click');
    onPause();
  };

  const handleMuteClick = () => {
    playSound('click');
    onMute();
  };

  return (
    <div className="flex justify-between items-center score-panel p-4 rounded-xl shadow-lg my-4">
      {/* Grupo Izquierdo: Puntos y Racha */}
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold text-blue-700">
          Puntos: <span id="score" className={scoreClasses}>{score}</span>
        </div>
        <div className="text-xl font-bold text-lime-700">
          <div id="streakContainer">
            Racha: <span id="streak" className={streakClasses}>{streak}</span>
          </div>
        </div>
      </div>

      {/* Grupo Central: Nivel y Récord */}
      <div className="text-center flex flex-col gap-2">
        <div className="text-2xl font-bold text-amber-700">
          Nivel <span id="level" className="p-2 bg-amber-100 rounded-lg shadow-inner">{level}</span>
        </div>
        <div className="text-lg font-bold text-yellow-600">
          Récord: <span id="highScore" className="p-2 bg-yellow-100 rounded-lg shadow-inner">{highScore}</span>
        </div>
        {/* Barra de Temporizador de Power-Up */}
        <div
          id="powerUpTimerContainer"
          className="mt-1"
          style={{ opacity: powerUpTimeLeft > 0 ? 1 : 0 }}
        >
          <div
            id="powerUpTimerBar"
            style={{ width: `${powerUpTimeLeft}%` }}
          ></div>
        </div>
      </div>

      {/* Grupo Derecho: Vidas y Sonido */}
      <div className="flex flex-col items-end gap-2">
        <div id="lives" className="flex gap-1">
          {hearts}
        </div>
        <div className="flex gap-2">
          <button id="pauseBtn" title="Pausar Juego" onClick={handlePauseClick}>||</button>
          <button id="muteBtn" title="Activar/Desactivar Sonido" onClick={handleMuteClick}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScoreDisplay);