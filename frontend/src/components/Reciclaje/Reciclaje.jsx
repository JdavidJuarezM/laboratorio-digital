// frontend/src/components/Reciclaje/Reciclaje.jsx
import React, { useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
// Corrección: Añadidas extensiones .js y .jsx a todas las importaciones
import { useReciclaje } from './hooks/useReciclaje.js';
import { binData } from './constants.js';
import { initReciclajeAudio, playSound } from './soundService.js';

// Importar todos los sub-componentes con .jsx
import Bote from './Bote.jsx';
import Basura from './Basura.jsx';
import Paisaje from './Paisaje.jsx';
import ScoreDisplay from './ScoreDisplay.jsx';
import WelcomeModal from './WelcomeModal.jsx';
import GameOverModal from './GameOverModal.jsx';
import PauseModal from './PauseModal.jsx';
import EcoBot from './EcoBot.jsx';

// Importa el CSS para las animaciones
import './Reciclaje.css';

const Reciclaje = () => {
  const { state, dispatch, startGame, togglePause, toggleMute, handleDrop } = useReciclaje();

  // Inicializar el audio al montar el componente
  useEffect(() => {
    initReciclajeAudio();
  }, []);

  // Manejador para el DndContext
  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active) {
      // 'active.data.current' tiene el objeto 'item' que pasamos en Basura.jsx
      const item = active.data.current;
      const binId = over.id;

      // Encontramos el bote (aunque solo necesitamos el ID)
      const bin = binData.find(b => b.id === binId);
      if (bin) {
        handleDrop(item, bin);
      }
    } else {
      // El drop no fue sobre un bote (lo contamos como "miss")
      if (state.gameState === 'playing' && state.currentItem) {
        // Solo resta vida si había un item y no está en modo fiebre
        if (state.currentItem.type !== 'danger' && !state.isFeverModeActive) {
          dispatch({ type: 'HANDLE_WRONG', message: '¡Se te cayó!' });
          playSound('error');
        } else if (state.currentItem.type === 'danger' && !state.isFeverModeActive) {
          // Si una bomba toca el suelo (no se suelta en un bote), la evitas
          const points = state.isDoublePointsActive ? 50 : 25;
          dispatch({ type: 'HANDLE_BOMB_AVOIDED', payload: { points } });
          playSound('correct');
        }
      }
    }
  }

  // --- Renderizado ---
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        id="gameContainer"
        className={`w-full h-full relative overflow-hidden ${state.isFeverModeActive ? 'fever-mode' : ''} ${state.gameState === 'playing' ? `level-${state.currentLevel}` : 'level-1'}`}
      >
        <Paisaje />

        {/* Efecto de flash al subir de nivel */}
        {state.screenFlash && <div id="screenFlash" className="flash-animation" />}

        {/* Renderizar Modales */}
        {state.gameState === 'welcome' && <WelcomeModal onStart={startGame} />}
        {state.gameState === 'gameOver' && (
          <GameOverModal
            score={state.score}
            highScore={state.highScore}
            stats={state.gameStats}
            onRestart={startGame}
          />
        )}
        {state.gameState === 'paused' && <PauseModal onResume={togglePause} />}

        <EcoBot message={state.botMessage} expression={state.botExpression} />

        <div className="w-full max-w-5xl mx-auto z-10 relative p-4">
          <ScoreDisplay
            score={state.score}
            highScore={state.highScore}
            lives={state.lives}
            level={state.currentLevel}
            streak={state.currentStreak}
            onPause={togglePause}
            onMute={toggleMute}
            isMuted={state.isMuted}
            isFeverMode={state.isFeverModeActive}
            isDoublePoints={state.isDoublePointsActive}
            powerUpTimeLeft={state.powerUpTimeLeft}
          />

          <div
            id="conveyorBelt"
            className={`h-56 rounded-xl flex items-center justify-center relative p-4 overflow-hidden ${state.isFeverModeActive ? 'slowmo-active' : ''}`}
            style={{ '--belt-speed': `${state.timerSpeed / 100}s` }}
          >
            <div className="conveyor-roller left"></div>
            <div className="conveyor-roller right"></div>

            <div id="trashSpawn" className="z-20">
              {/* Renderizar la basura actual si existe */}
              {state.currentItem && <Basura item={state.currentItem} />}
            </div>

            <div className="absolute bottom-0 left-0 h-3 bg-gray-900 w-full rounded-b-xl">
              <div
                id="itemTimerBar"
                className={`h-full ${state.itemTimerFill < 30 ? 'bg-red-500' : state.itemTimerFill < 60 ? 'bg-yellow-500' : 'bg-green-500'} rounded-b-xl`}
                style={{ width: `${state.itemTimerFill}%` }}
              ></div>
            </div>
          </div>

          <div id="binContainer" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            {binData.map(bin => (
              <Bote
                key={bin.id}
                id={bin.id}
                label={bin.label}
                icon={bin.icon}
                color={bin.color}
              />
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Reciclaje;