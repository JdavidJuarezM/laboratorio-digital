// frontend/src/components/Vocabulario/hooks/useVocabulario.js

import {useState, useEffect, useCallback, useRef} from "react";
import {useAuth} from "../../../context/AuthContext";
import {words as defaultWords} from "../constants/wordList"; // Renombramos las estáticas
import {
    audioEffects,
    initAudio,
    speakWord as speakWordService,
} from "../services/ttsService";
import {getHighScore, saveScore, getPalabras} from "../services/vocabularioService"; // Importamos getPalabras

const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const useVocabulario = () => {
    const {user} = useAuth();

    const [gameState, setGameState] = useState("start");

    // Modificado: Se elimina playerName y se agrega category
    const [settings, setSettings] = useState({
        difficulty: "easy",
        category: "Todas",
        timerEnabled: true,
    });

    const [highScore, setHighScore] = useState({
        score: 0,
        streak: 0,
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

    // Cargar HighScore inicial
    useEffect(() => {
        const loadScore = async () => {
            const data = await getHighScore();
            if (data) {
                setHighScore({
                    score: data.highScore || 0,
                    streak: data.streak || 0,
                });
            }
        };
        loadScore();
    }, [user]);

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
        setFloatingFeedback({message, type});
        setTimeout(() => setFloatingFeedback({message: "", type: ""}), 1500);
    };

    // Guardado silencioso al terminar
    const handleSaveHighScore = useCallback(() => {
        const {points, longestStreak} = gameStats;
        if (points > highScore.score) {
            saveScore(points, longestStreak).catch(err => console.error("Error guardando score:", err));
            setHighScore((prev) => ({
                ...prev,
                score: points,
                streak: longestStreak,
            }));
        }
    }, [gameStats, highScore]);

    const nextWord = useCallback(() => {
        clearInterval(timerIntervalRef.current);
        hasTimeExpired.current = false;

        if (wordsAvailable.length === 0) {
            setGameState("end");
            audioEffects.playGameOver();
            handleSaveHighScore();
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

    // --- Lógica de Inicio Actualizada (Carga Dinámica y Filtro) ---
    const startGame = useCallback(async () => {
        initAudio();
        setGameStats({
            wordsCompleted: 0,
            points: 0,
            streak: 0,
            longestStreak: 0,
            attempts: 0,
        });

        try {
            // 1. Obtener palabras del backend
            const dynamicWords = await getPalabras();

            // 2. Mapear al formato del juego
            const mappedDynamic = dynamicWords.map(w => ({
                word: w.palabra,
                image: w.imagenUrl,
                difficulty: w.dificultad,
                category: w.categoria
            }));

            // 3. Combinar con las palabras por defecto
            const allWords = [...defaultWords, ...mappedDynamic];

            // 4. Filtrar por Dificultad Y Categoría
            const filteredWords = allWords.filter((w) => {
                const difficultyMatch = w.difficulty === settings.difficulty;
                // Si la categoría es "Todas", incluimos todo lo que coincida en dificultad
                const categoryMatch = settings.category === "Todas" || w.category === settings.category;
                return difficultyMatch && categoryMatch;
            });

            // Fallback: Si el filtro deja 0 palabras, usamos al menos las que coincidan en dificultad
            const finalList = filteredWords.length > 0
                ? filteredWords
                : allWords.filter(w => w.difficulty === settings.difficulty);

            // Mezclar y tomar 10
            const available = shuffle(finalList).slice(0, 10);

            setWordsAvailable(available);
            setCurrentWord(null);
            setGameState("playing");

        } catch (error) {
            console.error("Error al iniciar juego:", error);
            // Fallback en caso de error de red
            const fallbackWords = defaultWords.filter(w => w.difficulty === settings.difficulty);
            setWordsAvailable(shuffle(fallbackWords).slice(0, 10));
            setGameState("playing");
        }
    }, [settings.difficulty, settings.category]);

    // Efecto para iniciar la primera palabra
    useEffect(() => {
        if (gameState === "playing" && !currentWord && wordsAvailable.length > 0) {
            nextWord();
        }
    }, [gameState, currentWord, wordsAvailable, nextWord]);

    // Efecto del Temporizador
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
            setGameStats((prev) => ({...prev, streak: 0}));
            setTimeout(nextWord, 1000);
        }
    }, [timer, settings.timerEnabled, gameState, nextWord]);

    const handleLetterClick = (letter, buttonIndex) => {
        if (!currentWord || userInput.length >= currentWord.word.length) return;

        const newUserInput = [...userInput, {letter, buttonIndex}];
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
        setGameStats((prev) => ({...prev, streak: 0}));
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