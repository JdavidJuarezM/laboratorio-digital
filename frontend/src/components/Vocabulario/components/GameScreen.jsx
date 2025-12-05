// src/components/Vocabulario/components/GameScreen.jsx

import React, {useMemo, useState} from "react";

// --- SUB-COMPONENTES INTERNOS ---

const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const TimerBar = ({timer, timerDuration}) => {
    const timerProgress = timerDuration > 0 ? (timer / timerDuration) * 100 : 0;
    const timerColor =
        timerProgress <= 20
            ? "bg-red-500"
            : timerProgress <= 40
                ? "bg-yellow-500"
                : "bg-green-500";

    return (
        <div
            className="w-full h-3 md:h-4 lg:h-5 bg-gray-200 rounded-full my-1 overflow-hidden shadow-inner border border-gray-300">
            <div
                className={`h-full ${timerColor} transition-all duration-1000 ease-linear`}
                style={{width: `${timerProgress}%`}}
            ></div>
        </div>
    );
};

const UserInputDisplay = ({word, userInput}) => (
    <div
        className="flex justify-center gap-1 sm:gap-2 md:gap-3 flex-wrap items-center w-full min-h-[60px] md:min-h-[80px]">
        {word &&
            [...word].map((_, i) => (
                <div
                    key={i}
                    className={`flex items-center justify-center rounded-lg sm:rounded-xl bg-gray-100 border-2 border-gray-300 shadow-sm text-gray-800 
                      w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 
                      text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black transform transition-all duration-200
                      ${
                        userInput.length === i
                            ? "border-blue-500 ring-2 sm:ring-4 ring-blue-100 scale-110 z-10"
                            : ""
                    }
                      ${
                        userInput[i] ? "bg-white border-blue-200 text-blue-600" : ""
                    }`}
                >
                    {userInput[i]?.letter || ""}
                </div>
            ))}
    </div>
);

const LetterTray = ({letters, userInput, onLetterClick}) => (
    <div
        className="bg-purple-50 rounded-2xl p-2 sm:p-4 lg:p-6 flex justify-center flex-wrap gap-2 sm:gap-3 lg:gap-4 my-2 border-2 border-purple-100 w-full shadow-inner overflow-y-auto max-h-[30vh]">
        {letters.map(({letter, index}) => {
            const isDisabled = userInput.some((u) => u.buttonIndex === index);
            return (
                <button
                    key={index}
                    onClick={() => onLetterClick(letter, index)}
                    disabled={isDisabled}
                    className={`button bg-white text-purple-700 font-black border-b-4 border-purple-200
                      w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20
                      text-lg sm:text-2xl md:text-3xl lg:text-4xl rounded-xl
                      flex items-center justify-center shadow-sm transition-all duration-150 
                      hover:bg-purple-100 hover:border-purple-300 hover:-translate-y-1
                      active:border-b-0 active:translate-y-1
                      ${
                        isDisabled
                            ? "opacity-40 cursor-not-allowed scale-90 border-none bg-gray-100 text-gray-400 shadow-none"
                            : ""
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
        // CAMBIO CLAVE: Quitamos 'fixed inset-0' para que respete el contenedor padre (GameFrame)
        // Usamos 'w-full h-full' para llenar el espacio disponible debajo del header.
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">

            {/* Tarjeta principal */}
            <div
                className="card w-full max-w-screen-2xl h-full bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden border-4 border-white">

                {/* Header */}
                <div
                    className="bg-blue-500 p-2 sm:p-3 lg:p-4 text-white grid grid-cols-2 md:grid-cols-4 gap-2 items-center justify-items-center shadow-md z-10 shrink-0">
                    <div className="flex flex-col items-center">
                        <span
                            className="text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Palabra</span>
                        <span className="text-base sm:text-xl lg:text-2xl font-black">{gameStats.attempts}/10</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span
                            className="text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Aciertos</span>
                        <span
                            className="text-base sm:text-xl lg:text-2xl font-black flex items-center gap-1">✅ {gameStats.wordsCompleted}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span
                            className="text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Puntos</span>
                        <span
                            className="text-base sm:text-xl lg:text-2xl font-black flex items-center gap-1">🌟 {gameStats.points}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span
                            className="text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Racha</span>
                        <span
                            className="text-base sm:text-xl lg:text-2xl font-black flex items-center gap-1">🔥 {gameStats.streak}</span>
                    </div>
                </div>

                {/* Cuerpo Flexible con scroll automático */}
                <div className="flex-1 flex flex-col items-center p-2 sm:p-4 overflow-y-auto min-h-0">

                    {/* 1. SECCIÓN IMAGEN */}
                    <div
                        className="flex-1 w-full flex flex-col items-center justify-center min-h-0 shrink basis-auto py-1">
                        <div className="relative group">
                            <div
                                className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            {/* Ajustamos la altura máxima relativa para que no empuje demasiado */}
                            <img
                                src={currentWord?.image}
                                className="relative h-auto w-auto max-h-[25vh] sm:max-h-[30vh] lg:max-h-[35vh] object-contain rounded-xl border-4 border-white shadow-xl bg-gray-50"
                                alt="Pista visual"
                            />
                        </div>

                        {settings.timerEnabled && (
                            <div className="w-full max-w-xl mt-2 px-4">
                                <TimerBar timer={timer} timerDuration={timerDuration}/>
                            </div>
                        )}
                    </div>

                    {/* 2. SECCIÓN INPUTS */}
                    <div className="w-full shrink-0 py-1">
                        <UserInputDisplay word={currentWord?.word} userInput={userInput}/>
                    </div>

                    {/* 3. SECCIÓN TECLADO */}
                    <div className="w-full max-w-6xl shrink-0 mb-1">
                        <LetterTray
                            letters={letterTray}
                            userInput={userInput}
                            onLetterClick={handleLetterClick}
                        />
                    </div>

                    {/* 4. SECCIÓN BOTONES */}
                    <div className="w-full flex flex-col items-center gap-2 shrink-0 mt-auto pt-1">
                        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 w-full">

                            <button
                                onClick={speakWord}
                                disabled={isListening}
                                className="flex-1 min-w-[100px] max-w-[200px] py-2 sm:py-3 rounded-xl font-bold bg-blue-100 text-blue-600 hover:bg-blue-200 border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg shadow-md"
                            >
                                <span>🔊</span> <span
                                className="hidden sm:inline">{isListening ? "..." : "Escuchar"}</span>
                            </button>

                            <button
                                onClick={() => handleHint(letterTray)}
                                className="flex-1 min-w-[100px] max-w-[200px] py-2 sm:py-3 rounded-xl font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-b-4 border-yellow-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg shadow-md"
                            >
                                <span>💡</span> <span className="hidden sm:inline">Pista (-5)</span>
                            </button>

                            <button
                                onClick={handleBackspace}
                                className="flex-1 min-w-[100px] max-w-[200px] py-2 sm:py-3 rounded-xl font-bold bg-red-100 text-red-600 hover:bg-red-200 border-b-4 border-red-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg shadow-md"
                            >
                                <span>⌫</span> <span className="hidden sm:inline">Borrar</span>
                            </button>

                            <button
                                onClick={handleSkip}
                                className="flex-1 min-w-[100px] max-w-[200px] py-2 sm:py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg shadow-md"
                            >
                                <span>⏭️</span> <span className="hidden sm:inline">Saltar</span>
                            </button>
                        </div>

                        <button
                            onClick={onHelp}
                            className="text-gray-400 hover:text-blue-500 font-bold text-xs sm:text-sm underline transition-colors"
                        >
                            Ayuda
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GameScreen;