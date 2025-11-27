// frontend/src/components/Vocabulario/hooks/useVocabulario.js

import { useState, useEffect, useCallback, useRef } from "react";
// Mantenemos useAuth solo para cargar el nombre inicial si quieres,
// pero la lógica de guardado priorizará el input.
import { useAuth } from "../../../context/AuthContext";
import { words } from "../constants/wordList";
import {
  audioEffects,
  initAudio,
  speakWord as speakWordService,
} from "../services/ttsService";
import { getHighScore, saveScore } from "../services/vocabularioService";

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useVocabulario = () => {
  const { user } = useAuth();

  const [gameState, setGameState] = useState("start");
  const [settings, setSettings] = useState({
    playerName: "",
    difficulty: "easy",
    timerEnabled: true,
  });
  const [highScore, setHighScore] = useState({
    score: 0,
    streak: 0,
    player: "",
  });
  const [gameStats, setGameStats] = useState({
    wordsCompleted: 0,
    points: 0,
    streak: 0,
    longestStreak: 0,
    attempts: 0,
  });
  const [currentWord, setCurrentWord] = useState(null);
  const [wordsAvailable, setWordsAvailable] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [timer, setTimer] = useState(30);
  const [hasHintBeenUsed, setHasHintBeenUsed] = useState(false);
  const [floatingFeedback, setFloatingFeedback] = useState({
    message: "",
    type: "",
  });
  const timerIntervalRef = useRef(null);
  const hasTimeExpired = useRef(false);

  // Cargar HighScore inicial (Aquí sí usamos el de la cuenta o "Tú" como placeholder)
  useEffect(() => {
    const loadScore = async () => {
      const data = await getHighScore();
      if (data) {
        setHighScore({
          score: data.highScore || 0,
          streak: data.streak || 0,
          player: user?.nombre || "Tú",
        });
      }
    };
    loadScore();
  }, [user]);

  // --- AQUÍ ESTÁ LA CORRECCIÓN ---
  const handleSaveHighScore = useCallback(() => {
    const { points, longestStreak } = gameStats;

    // Usamos el nombre que el usuario escribió en el input.
    // Si lo dejó vacío, usamos "Anónimo" o el de la cuenta.
    const nombreJugador = settings.playerName.trim() || user?.nombre || "Anónimo";

    if (points > highScore.score) {
      // Guardamos en el backend (se vincula a la cuenta logueada)
      saveScore(points, longestStreak).catch(err => console.error(err));

      // Actualizamos el estado visual con el NOMBRE DEL INPUT
      setHighScore((prev) => ({
        ...prev,
        score: points,
        streak: longestStreak,
        player: nombreJugador, // <--- Este es el cambio que pediste
      }));
    }
  }, [gameStats, highScore, settings.playerName, user]); // Agregamos settings.playerName a dependencias

  const getTimerForDifficulty = useCallback(() => {
    switch (settings.difficulty) {
      case "easy": return 45;
      case "medium": return 30;
      case "hard": return 20;
      default: return 30;
    }
  }, [settings.difficulty]);

  const showFloatingFeedback = (message, type) => {
    setFloatingFeedback({ message, type });
    setTimeout(() => setFloatingFeedback({ message: "", type: "" }), 1500);
  };

  const nextWord = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    hasTimeExpired.current = false;

    if (wordsAvailable.length === 0) {
      setGameState("end");
      audioEffects.playGameOver();
      handleSaveHighScore(); // Al terminar llama a la función corregida
      return;
    }

    const newWordsAvailable = [...wordsAvailable];
    const nextWordData = newWordsAvailable.pop();

    setWordsAvailable(newWordsAvailable);
    setCurrentWord(nextWordData);
    setUserInput([]);
    setHasHintBeenUsed(false);

    setGameStats((prev) => ({
      ...prev,
      attempts: prev.attempts + 1,
    }));

    if (settings.timerEnabled) {
      const initialTime = getTimerForDifficulty();
      setTimer(initialTime);
      timerIntervalRef.current = setInterval(() => {
        setTimer((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
  }, [
    wordsAvailable,
    settings.timerEnabled,
    handleSaveHighScore,
    getTimerForDifficulty,
  ]);

  const startGame = useCallback(() => {
    initAudio();
    setGameStats({
      wordsCompleted: 0,
      points: 0,
      streak: 0,
      longestStreak: 0,
      attempts: 0,
    });
    const filteredWords = words.filter(
      (w) => w.difficulty === settings.difficulty
    );
    const available = shuffle(filteredWords).slice(0, 10);

    setWordsAvailable(available);
    setCurrentWord(null);
    setGameState("playing");
  }, [settings.difficulty]);

  useEffect(() => {
    if (gameState === "playing" && !currentWord && wordsAvailable.length > 0) {
      nextWord();
    }
  }, [gameState, currentWord, wordsAvailable, nextWord]);

  useEffect(() => {
    if (
      timer === 0 &&
      settings.timerEnabled &&
      gameState === "playing" &&
      !hasTimeExpired.current
    ) {
      hasTimeExpired.current = true;
      showFloatingFeedback("¡Tiempo!", "error");
      audioEffects.playWrong();
      setGameStats((prev) => ({ ...prev, streak: 0 }));
      setTimeout(nextWord, 1000);
    }
  }, [timer, settings.timerEnabled, gameState, nextWord]);

  const handleLetterClick = (letter, buttonIndex) => {
    if (!currentWord || userInput.length >= currentWord.word.length) return;

    const newUserInput = [...userInput, { letter, buttonIndex }];
    setUserInput(newUserInput);
    const currentString = newUserInput.map((i) => i.letter).join("");

    if (currentString === currentWord.word) {
      const timeBonus = settings.timerEnabled ? Math.round(timer * 0.5) : 0;
      const streakBonus = gameStats.streak * 5;
      const hintPenalty = hasHintBeenUsed ? -10 : 0;
      const wordPoints = 20 + timeBonus + streakBonus + hintPenalty;

      setGameStats((prev) => ({
        ...prev,
        points: prev.points + Math.max(0, wordPoints),
        wordsCompleted: prev.wordsCompleted + 1,
        streak: prev.streak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.streak + 1),
      }));

      audioEffects.playCorrectWord();
      showFloatingFeedback("¡Genial!", "success");
      setTimeout(nextWord, 1500);
    } else if (currentWord.word.startsWith(currentString)) {
      audioEffects.playCorrectLetter();
    } else {
      audioEffects.playWrong();
      showFloatingFeedback("Inténtalo de nuevo", "error");
      setUserInput([]);
    }
  };

  const handleBackspace = () => {
    if (userInput.length > 0) {
      audioEffects.playBackspace();
      setUserInput((prev) => prev.slice(0, -1));
    }
  };

  const handleSkip = () => {
    audioEffects.playSkip();
    setGameStats((prev) => ({ ...prev, streak: 0 }));
    nextWord();
  };

  const handleHint = (letterTray) => {
    if (
      hasHintBeenUsed ||
      !currentWord ||
      userInput.length >= currentWord.word.length
    )
      return;

    const correctLetter = currentWord.word[userInput.length];
    const letterButton = letterTray.find(
      (item) =>
        item.letter === correctLetter &&
        !userInput.some((u) => u.buttonIndex === item.index)
    );

    if (letterButton) {
      handleLetterClick(letterButton.letter, letterButton.index);
      setGameStats((prev) => ({
        ...prev,
        points: Math.max(0, prev.points - 5),
      }));
      setHasHintBeenUsed(true);
    }
  };

  const restartGame = () => {
    setCurrentWord(null);
    setWordsAvailable([]);
    setGameState("start");
  };

  const getAndCacheAudio = useCallback((word) => {
    speakWordService(word);
  }, []);

  return {
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
  };
};