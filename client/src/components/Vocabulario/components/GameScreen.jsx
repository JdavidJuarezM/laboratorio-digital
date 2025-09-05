// src/components/Vocabulario/components/GameScreen.jsx

import React, { useMemo, useState } from "react";

// --- SUB-COMPONENTES INTERNOS ---

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const TimerBar = ({ timer, timerDuration }) => {
  const timerProgress = timerDuration > 0 ? (timer / timerDuration) * 100 : 0;
  const timerColor =
    timerProgress <= 20
      ? "bg-red-500"
      : timerProgress <= 40
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full my-4 overflow-hidden shadow-inner">
      <div
        className={`h-full ${timerColor} transition-all duration-500 ease-linear`}
        style={{ width: `${timerProgress}%` }}
      ></div>
    </div>
  );
};

const UserInputDisplay = ({ word, userInput }) => (
  <div className="flex justify-center gap-1.5 sm:gap-3 flex-wrap h-auto items-center w-full px-1">
    {word &&
      [...word].map((_, i) => (
        <div
          key={i}
          className={`flex items-center justify-center rounded-lg bg-gray-200 border-gray-300 drop-shadow-sm text-gray-800 
                      w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold 
                      ${
                        userInput.length === i
                          ? "border-blue-500 shadow-lg border-3"
                          : "border-2"
                      }`}
        >
          {userInput[i]?.letter || ""}
        </div>
      ))}
  </div>
);

const LetterTray = ({ letters, userInput, onLetterClick }) => (
  <div className="bg-pink-100 rounded-2xl p-4 flex justify-center flex-wrap gap-2 sm:gap-3 my-6 border-2 border-pink-300 shadow-inner w-full">
    {letters.map(({ letter, index }) => {
      const isDisabled = userInput.some((u) => u.buttonIndex === index);
      return (
        <button
          key={index}
          onClick={() => onLetterClick(letter, index)}
          disabled={isDisabled}
          className={`button letter-button bg-pink-500 hover:bg-pink-600 text-white font-bold 
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full text-xl sm:text-2xl 
                      flex items-center justify-center shadow-md transition-all duration-150 
                      ${
                        isDisabled
                          ? "opacity-30 cursor-not-allowed scale-90"
                          : "hover:scale-110"
                      }`}
        >
          {letter}
        </button>
      );
    })}
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const GameScreen = ({
  gameStats,
  currentWord,
  userInput,
  timer,
  timerDuration,
  settings,
  handleLetterClick,
  handleBackspace,
  handleSkip,
  handleHint,
  onHelp,
  getAndCacheAudio,
}) => {
  const [isListening, setIsListening] = useState(false);

  const letterTray = useMemo(() => {
    if (!currentWord) return [];
    const wordLetters = currentWord.word.split("");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const numExtraLetters = Math.min(8, 14 - wordLetters.length);
    const extraLetters = shuffle(
      alphabet.filter((l) => !wordLetters.includes(l))
    ).slice(0, numExtraLetters);
    return shuffle([...wordLetters, ...extraLetters]).map((letter, index) => ({
      letter,
      index,
    }));
  }, [currentWord]);

  const speakWord = async () => {
    if (isListening || !currentWord) return;
    setIsListening(true);
    await getAndCacheAudio(currentWord.word);
    setTimeout(() => setIsListening(false), 500);
  };

  return (
    <div className="card p-4 sm:p-6 md:p-8 bg-white rounded-3xl shadow-2xl border-4 border-blue-400 relative flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-sm sm:text-base lg:text-lg font-bold text-gray-600 border-b-2 border-gray-100 pb-4 w-full">
        <span className="flex items-center justify-center gap-1 sm:gap-2 text-blue-600">
          🎯<span className="hidden sm:inline text-gray-700">Palabra:</span>{" "}
          {gameStats.attempts}/10
        </span>
        <span className="flex items-center justify-center gap-1 sm:gap-2 text-green-600">
          ✅<span className="hidden sm:inline text-gray-700">Aciertos:</span>{" "}
          {gameStats.wordsCompleted}
        </span>
        <span className="flex items-center justify-center gap-1 sm:gap-2 text-yellow-500">
          🌟<span className="hidden sm:inline text-gray-700">Puntos:</span>{" "}
          {gameStats.points}
        </span>
        <span className="flex items-center justify-center gap-1 sm:gap-2 text-red-500">
          🔥<span className="hidden sm:inline text-gray-700">Racha:</span>{" "}
          {gameStats.streak}
        </span>
      </div>

      <div className="flex flex-col items-center my-2 sm:my-4 flex-grow w-full">
        <img
          src={currentWord?.image}
          className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-xl border-4 border-yellow-400 shadow-lg mb-4 sm:mb-6 transform transition-transform duration-300 hover:scale-105 object-cover"
          alt="Pista visual de la palabra"
        />
        <UserInputDisplay word={currentWord?.word} userInput={userInput} />
      </div>

      {settings.timerEnabled && (
        <TimerBar timer={timer} timerDuration={timerDuration} />
      )}

      <LetterTray
        letters={letterTray}
        userInput={userInput}
        onLetterClick={handleLetterClick}
      />

      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-4 w-full">
        <button
          onClick={speakWord}
          disabled={isListening}
          className="button bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full shadow-lg flex-1 min-w-[120px] transition-transform transform hover:scale-105"
        >
          <i className="fas fa-volume-up mr-2"></i>
          {isListening ? "..." : "Escuchar"}
        </button>
        <button
          onClick={() => handleHint(letterTray)}
          className="button bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-full shadow-lg flex-1 min-w-[120px] transition-transform transform hover:scale-105"
        >
          <i className="fas fa-lightbulb mr-2"></i>
          Pista (-5)
        </button>
        <button
          onClick={handleBackspace}
          className="button bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full shadow-lg flex-1 min-w-[120px] transition-transform transform hover:scale-105"
        >
          <i className="fas fa-backspace mr-2"></i>
          Borrar
        </button>
        <button
          onClick={handleSkip}
          className="button bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full shadow-lg flex-1 min-w-[120px] transition-transform transform hover:scale-105"
        >
          <i className="fas fa-forward mr-2"></i>
          Saltar
        </button>
      </div>
      <button
        onClick={onHelp}
        className="button mt-6 text-blue-500 hover:text-blue-700 font-semibold transition"
      >
        Ayuda
      </button>
    </div>
  );
};

export default GameScreen;
