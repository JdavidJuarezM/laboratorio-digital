// src/components/Vocabulario/Vocabulario.jsx

import React, { useState } from "react";
import { useVocabulario } from "./hooks/useVocabulario";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import EndModal from "./components/EndModal";
import HelpModal from "./components/HelpModal";

const Vocabulario = () => {
  const {
    gameState,
    settings,
    setSettings,
    highScore,
    gameStats,
    currentWord,
    userInput,
    timer,
    getTimerForDifficulty,
    startGame,
    handleLetterClick,
    handleBackspace,
    handleSkip,
    handleHint,
    restartGame,
    getAndCacheAudio,
    floatingFeedback,
  } = useVocabulario();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4 relative overflow-y-auto">
      {gameState === "start" && (
        <StartScreen
          startGame={startGame}
          settings={settings}
          setSettings={setSettings}
          highScore={highScore}
          onHelp={() => setShowHelp(true)}
        />
      )}

      {gameState === "playing" && currentWord && (
        <>
          <GameScreen
            gameStats={gameStats}
            currentWord={currentWord}
            userInput={userInput}
            timer={timer}
            timerDuration={getTimerForDifficulty()}
            settings={settings}
            handleLetterClick={handleLetterClick}
            handleBackspace={handleBackspace}
            handleSkip={handleSkip}
            handleHint={handleHint}
            onHelp={() => setShowHelp(true)}
            getAndCacheAudio={getAndCacheAudio}
          />
          {floatingFeedback.message && (
            <div
              className={`feedback-message-floating show ${
                floatingFeedback.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {floatingFeedback.message}
            </div>
          )}
        </>
      )}

      {gameState === "end" && (
        <EndModal gameStats={gameStats} restartGame={restartGame} />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Vocabulario;
