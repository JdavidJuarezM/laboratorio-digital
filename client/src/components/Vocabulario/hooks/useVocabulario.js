import { useState, useEffect, useCallback, useRef } from "react";
import { words } from "../constants/wordList";
import {
  audioEffects,
  initAudio,
  speakWord as speakWordService,
} from "../services/ttsService";

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useVocabulario = () => {
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
  const hasTimeExpired = useRef(false); // 👈 fix para evitar loop infinito

  useEffect(() => {
    const savedScore = localStorage.getItem("juegoVocabularioHighScore");
    const savedStreak = localStorage.getItem("juegoVocabularioLongestStreak");
    const savedPlayer = localStorage.getItem("juegoVocabularioHighPlayer");

    setHighScore({
      score: savedScore ? parseInt(savedScore, 10) : 0,
      streak: savedStreak ? parseInt(savedStreak, 10) : 0,
      player: savedPlayer || "",
    });
  }, []);

  const saveHighScore = useCallback(() => {
    const { points, longestStreak } = gameStats;
    const currentPlayerName = settings.playerName.trim() || "Anónimo";

    if (points > highScore.score) {
      localStorage.setItem("juegoVocabularioHighScore", points);
      localStorage.setItem("juegoVocabularioHighPlayer", currentPlayerName);
      setHighScore((prev) => ({
        ...prev,
        score: points,
        player: currentPlayerName,
      }));
    }
    if (longestStreak > highScore.streak) {
      localStorage.setItem("juegoVocabularioLongestStreak", longestStreak);
      setHighScore((prev) => ({ ...prev, streak: longestStreak }));
    }
  }, [gameStats, settings.playerName, highScore]);

  const getTimerForDifficulty = useCallback(() => {
    switch (settings.difficulty) {
      case "easy":
        return 45;
      case "medium":
        return 30;
      case "hard":
        return 20;
      default:
        return 30;
    }
  }, [settings.difficulty]);

  const showFloatingFeedback = (message, type) => {
    setFloatingFeedback({ message, type });
    setTimeout(() => setFloatingFeedback({ message: "", type: "" }), 1500);
  };

  const nextWord = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    hasTimeExpired.current = false; // 👈 reset de la bandera para la próxima palabra

    if (wordsAvailable.length === 0) {
      setGameState("end");
      audioEffects.playGameOver();
      saveHighScore();
      return;
    }

    const newWordsAvailable = [...wordsAvailable];
    const nextWordData = newWordsAvailable.pop();

    setWordsAvailable(newWordsAvailable);
    setCurrentWord(nextWordData);
    setUserInput([]);
    setHasHintBeenUsed(false);

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
    saveHighScore,
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
    if (gameState === "playing" && wordsAvailable.length > 0 && !currentWord) {
      nextWord();
    }
  }, [gameState, wordsAvailable, currentWord, nextWord]);

  // 👇 FIX: evitar loop cuando timer llega a 0
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
