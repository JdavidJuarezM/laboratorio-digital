// frontend/src/components/Reciclaje/hooks/useReciclaje.js
import { useReducer, useEffect, useCallback, useRef } from 'react';
import {
  trashData,
  powerUpItems,
  dangerItem,
  levels,
  botMessages,
  INITIAL_LIVES,
  POWERUP_DURATION,
  FEVER_MODE_STREAK_TARGET,
  FEVER_MODE_DURATION,
  FEVER_MODE_SPAWN_INTERVAL
} from '../constants.js'; // <-- CORREGIDO: ../constants.js
import {
  initReciclajeAudio,
  playSound,
  toggleMute as toggleMuteService,
  pauseMusic,
  resumeMusic,
  stopBackgroundMusic
} from '../soundService.js'; // <-- CORREGIDO: ../soundService.js
import { getHighScore, saveHighScore } from '../reciclajeService.js'; // <-- CORREGIDO: ../../../services/reciclajeService.js

const initialState = {
  gameState: 'welcome', // 'welcome', 'playing', 'paused', 'gameOver'
  score: 0,
  highScore: 0,
  lives: INITIAL_LIVES,
  currentStreak: 0,
  currentLevel: 1,
  currentItem: null,
  timerSpeed: 100,
  itemTimeDuration: 10000,
  itemTimerFill: 100, // % de la barra de tiempo
  isDoublePointsActive: false,
  isFeverModeActive: false,
  powerUpTimeLeft: 0, // % de la barra de powerup
  isMuted: false,
  botMessage: '¡A reciclar!',
  botExpression: 'normal',
  gameStats: {
    itemsCorrect: 0,
    powerUpsCollected: 0,
    bombsAvoided: 0,
  },
  screenFlash: false, // Para el efecto de subir de nivel
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        gameState: 'playing',
        highScore: state.highScore, // Mantener el highscore cargado
        isMuted: state.isMuted,
        botMessage: '¡Empieza la misión!',
      };
    case 'GAME_OVER':
      stopBackgroundMusic();
      return {
        ...state,
        gameState: 'gameOver',
        botExpression: 'sad',
        botMessage: '¡Buen esfuerzo!',
        currentItem: null,
        isFeverModeActive: false,
        isDoublePointsActive: false,
      };
    case 'PAUSE':
      pauseMusic();
      return {
        ...state,
        gameState: 'paused',
        botExpression: 'paused',
      };
    case 'RESUME':
      resumeMusic();
      return {
        ...state,
        gameState: 'playing',
        botExpression: 'normal',
      };
    case 'SET_HIGH_SCORE':
      return { ...state, highScore: action.payload };
    case 'SPAWN_ITEM':
      return {
        ...state,
        currentItem: action.payload,
        itemTimerFill: 100,
      };
    case 'ITEM_TIMER_TICK':
      const newFill = state.itemTimerFill - (100 / (state.itemTimeDuration / state.timerSpeed));
      return {
        ...state,
        itemTimerFill: Math.max(0, newFill),
      };
    case 'POWERUP_TIMER_TICK':
      const newPowerUpTime = state.powerUpTimeLeft - (100 / (POWERUP_DURATION / 100)); // 100ms interval
      return {
        ...state,
        powerUpTimeLeft: Math.max(0, newPowerUpTime),
      };
    case 'HANDLE_CORRECT':
      return {
        ...state,
        score: state.score + action.payload.points,
        currentStreak: state.currentStreak + 1,
        currentItem: null,
        botMessage: action.payload.message,
        botExpression: 'happy',
        gameStats: {
          ...state.gameStats,
          itemsCorrect: state.gameStats.itemsCorrect + 1,
        },
      };
    case 'HANDLE_WRONG':
      return {
        ...state,
        lives: state.lives - 1,
        currentStreak: 0,
        currentItem: null,
        botMessage: action.payload.message,
        botExpression: 'sad',
      };
    case 'HANDLE_BOMB_AVOIDED':
      return {
        ...state,
        score: state.score + action.payload.points,
        currentItem: null,
        botMessage: '¡Bomba evitada!',
        botExpression: 'happy',
        gameStats: {
          ...state.gameStats,
          bombsAvoided: state.gameStats.bombsAvoided + 1,
        },
      };
    case 'LEVEL_UP':
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        timerSpeed: action.payload.speed,
        itemTimeDuration: action.payload.duration,
        botMessage: `¡${action.payload.name} alcanzado!`,
        screenFlash: true,
      };
    case 'FLASH_OFF':
      return { ...state, screenFlash: false };
    case 'SET_BOT_MESSAGE':
      return { ...state, botMessage: action.payload };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: action.payload }; // Recibe el nuevo estado
    case 'ACTIVATE_POWERUP':
      const { subType } = action.payload;
      return {
        ...state,
        lives: subType === 'life' ? Math.min(state.lives + 1, 3) : state.lives,
        timerSpeed: subType === 'slowmo' ? state.timerSpeed * 2 : state.timerSpeed,
        isDoublePointsActive: subType === 'doublePoints' ? true : state.isDoublePointsActive,
        powerUpTimeLeft: subType !== 'life' ? 100 : state.powerUpTimeLeft,
        gameStats: {
          ...state.gameStats,
          powerUpsCollected: state.gameStats.powerUpsCollected + 1,
        },
        currentItem: null,
      };
    case 'DEACTIVATE_POWERUP':
      // Resetea a la velocidad del nivel ACTUAL (si no, usa la base)
      const currentLevelSpeed = state.currentLevel > 1 ? levels[state.currentLevel - 2].speed : 100;
      return {
        ...state,
        timerSpeed: currentLevelSpeed,
        isDoublePointsActive: false,
        powerUpTimeLeft: 0,
      };
    case 'START_FEVER_MODE':
      return {
        ...state,
        isFeverModeActive: true,
        currentStreak: 0, // Reinicia la racha para la próxima
        botMessage: '¡MODO RACHA!',
        powerUpTimeLeft: 100, // Usa la barra para la duración del modo fiebre
      };
    case 'END_FEVER_MODE':
      return {
        ...state,
        isFeverModeActive: false,
        botMessage: '¡Racha terminada!',
        powerUpTimeLeft: 0,
        currentItem: null, // Limpia el último item de la fiebre
      };
    default:
      return state;
  }
}

export const useReciclaje = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {
    gameState,
    score,
    highScore,
    lives,
    currentStreak,
    currentLevel,
    isFeverModeActive,
    isDoublePointsActive,
    itemTimerFill,
    powerUpTimeLeft,
  } = state;

  // Refs para todos los temporizadores
  const itemTimerRef = useRef(null);
  const powerUpTimerRef = useRef(null);
  const feverSpawnRef = useRef(null);
  const feverDurationRef = useRef(null);
  const botMessageRef = useRef(null);
  const botExpressionRef = useRef(null);

  // --- SERVICIO DE API ---
  useEffect(() => {
    const loadScore = async () => {
      try {
        const data = await getHighScore();
        dispatch({ type: 'SET_HIGH_SCORE', payload: data.highScore || 0 });
      } catch (e) {
        console.error("No se pudo cargar el high score", e);
        const savedScore = localStorage.getItem('recycleHighScore') || 0;
        dispatch({ type: 'SET_HIGH_SCORE', payload: parseInt(savedScore, 10) });
      }
    };
    loadScore();
  }, []);

  const handleGameOver = useCallback(() => {
    if (score > highScore) {
      saveHighScore(score).catch(e => {
        console.error("No se pudo guardar el high score", e);
        localStorage.setItem('recycleHighScore', score.toString());
      });
    }
    dispatch({ type: 'GAME_OVER' });
  }, [score, highScore]);


  // --- MANEJO DE MENSAJES DEL BOT ---
  const setBotMessage = useCallback((message, duration = 2000) => {
    clearTimeout(botMessageRef.current);
    dispatch({ type: 'SET_BOT_MESSAGE', payload: message });
    botMessageRef.current = setTimeout(() => {
      dispatch({ type: 'SET_BOT_MESSAGE', payload: '' });
    }, duration);
  }, []);

  const setBotExpression = useCallback((expression, duration = 1500) => {
    clearTimeout(botExpressionRef.current);
    dispatch({ type: 'SET_BOT_EXPRESSION', payload: expression });
    botExpressionRef.current = setTimeout(() => {
      dispatch({ type: 'SET_BOT_EXPRESSION', payload: 'normal' });
    }, duration);
  }, []);


  // --- LÓGICA DE SPAWN ---
  const spawnNewTrash = useCallback(() => {
    const chance = Math.random();
    let item;
    if (isFeverModeActive) {
      item = chance < 0.15 ? powerUpItems[Math.floor(Math.random() * powerUpItems.length)] : trashData[Math.floor(Math.random() * trashData.length)];
    } else {
      if (chance < 0.10) item = powerUpItems[Math.floor(Math.random() * powerUpItems.length)];
      else if (chance < 0.20) item = dangerItem;
      else item = trashData[Math.floor(Math.random() * trashData.length)];
    }

    if (item.type === 'powerup') playSound('powerup-spawn');
    if (item.type === 'danger') playSound('bomb-spawn');

    dispatch({ type: 'SPAWN_ITEM', payload: item });
  }, [isFeverModeActive]);


  // --- TEMPORIZADORES PRINCIPALES ---
  useEffect(() => {
    if (gameState === 'playing' && !isFeverModeActive) {
      // Temporizador de item
      itemTimerRef.current = setInterval(() => {
        dispatch({ type: 'ITEM_TIMER_TICK' });
      }, state.timerSpeed);
    }
    return () => clearInterval(itemTimerRef.current);
  }, [gameState, state.timerSpeed, isFeverModeActive]);

  useEffect(() => {
    if (gameState === 'playing' && itemTimerFill <= 0) {
      // Se acabó el tiempo
      if (state.currentItem?.type === 'danger') {
        const points = isDoublePointsActive ? 50 : 25;
        dispatch({ type: 'HANDLE_BOMB_AVOIDED', payload: { points } });
        playSound('correct');
      } else {
        dispatch({ type: 'HANDLE_WRONG', message: '¡Se escapó!' });
        playSound('error');
        setBotExpression('sad', 2000);
      }
    }
  }, [itemTimerFill, gameState, state.currentItem, isDoublePointsActive, setBotExpression]);

  // Temporizador de Power-Up / Modo Fiebre
  useEffect(() => {
    if (gameState === 'playing' && (powerUpTimeLeft > 0)) {
      powerUpTimerRef.current = setInterval(() => {
        dispatch({ type: 'POWERUP_TIMER_TICK' });
      }, 100); // Intervalo más rápido para la barra
    }
    return () => clearInterval(powerUpTimerRef.current);
  }, [gameState, powerUpTimeLeft]);

  // Efecto para desactivar power-ups
  useEffect(() => {
    if (powerUpTimeLeft <= 0 && (isDoublePointsActive || state.timerSpeed > 100)) { // 100 es la velocidad base
      if (!isFeverModeActive) { // No desactivar si es por modo fiebre
        dispatch({ type: 'DEACTIVATE_POWERUP' });
        setBotMessage('¡Poder terminado!', 2000);
      }
    }
  }, [powerUpTimeLeft, isDoublePointsActive, state.timerSpeed, currentLevel, isFeverModeActive, setBotMessage]);


  // --- INICIO Y FIN MODO FIEBRE ---
  const startFeverMode = useCallback(() => {
    dispatch({ type: 'START_FEVER_MODE' });
    playSound('levelUp'); // Sonido especial

    // Limpia timers de item
    clearInterval(itemTimerRef.current);

    // Inicia spawns rápidos
    feverSpawnRef.current = setInterval(() => {
      // Lógica de spawn y puntos en modo fiebre
      playSound('correct');
      const points = isDoublePointsActive ? 10 : 5;
      dispatch({ type: 'HANDLE_CORRECT', payload: { points, message: '¡FIEBRE!' } });

      // Spawnear el siguiente item un poco después
      setTimeout(spawnNewTrash, 300); // 300ms para animacion de caida
    }, FEVER_MODE_SPAWN_INTERVAL);

    // Temporizador para terminar el modo fiebre
    feverDurationRef.current = setTimeout(() => {
      clearInterval(feverSpawnRef.current);
      dispatch({ type: 'END_FEVER_MODE' });
      spawnNewTrash(); // Spawnea un item normal
    }, FEVER_MODE_DURATION);
  }, [isDoublePointsActive, spawnNewTrash]);

  // --- LÓGICA DE DROP ---
  const handleDrop = useCallback((item, bin) => {
    if (gameState !== 'playing' || !item) return;

    clearInterval(itemTimerRef.current); // Detiene el timer del item

    // 1. Soltar Bomba
    if (item.type === 'danger') {
      dispatch({ type: 'HANDLE_WRONG', message: '¡BOOM! ¡Era una bomba!' });
      playSound('bomb-explode');
      setBotExpression('sad', 2000);
    }
    // 2. Acierto
    else if (item.type === bin.id) {
      const points = isDoublePointsActive ? 20 : 10;
      const streakBonus = isDoublePointsActive ? (currentStreak * 5 * 2) : (currentStreak * 5);
      const totalPoints = points + streakBonus;

      playSound('correct');
      setBotExpression('happy', 1500);

      if ((currentStreak + 1) % 3 === 0 && currentStreak > 0) {
        playSound('streak');
        setBotMessage(`¡RACHA de ${currentStreak + 1}! +${totalPoints}pts`, 1500);
      } else {
        setBotMessage(`¡Bien hecho! +${totalPoints}pts`, 1500);
      }

      dispatch({ type: 'HANDLE_CORRECT', payload: { points: totalPoints, message: `+${totalPoints}` } });
    }
    // 3. Power-up
    else if (item.type === 'powerup') {
      const points = isDoublePointsActive ? 10 : 5;
      dispatch({ type: 'HANDLE_CORRECT', payload: { points, message: `+${points}` } }); // Da puntos por recolectar
      dispatch({ type: 'ACTIVATE_POWERUP', payload: item });
      setBotMessage(`¡${item.name} activado!`, 2000);
      setBotExpression('happy', 1500);
    }
    // 4. Error
    else {
      dispatch({ type: 'HANDLE_WRONG', message: '¡Contenedor incorrecto!' });
      playSound('error');
      setBotExpression('sad', 2000);
    }
  }, [gameState, isDoublePointsActive, currentStreak, setBotExpression, setBotMessage]);

  // --- EFECTO POST-DROP (Revisar Vidas, Nivel, Racha) ---
  useEffect(() => {
    if (state.currentItem === null && gameState === 'playing') {
      // 1. Revisar si perdiste
      if (lives <= 0) {
        handleGameOver();
        return;
      }

      // 2. Revisar si sube de nivel
      const nextLevelData = levels[currentLevel - 1];
      if (nextLevelData && score >= nextLevelData.score) {
        dispatch({ type: 'LEVEL_UP', payload: nextLevelData });
        playSound('levelUp');
        setTimeout(() => dispatch({ type: 'FLASH_OFF' }), 500);
      }

      // 3. Revisar si activa modo fiebre
      if (currentStreak >= FEVER_MODE_STREAK_TARGET && !isFeverModeActive) {
        startFeverMode();
      }
      // 4. Si no está en modo fiebre, spawnear siguiente item
      else if (!isFeverModeActive) {
        // Pausa breve antes de spawnear
        setTimeout(spawnNewTrash, 300);
      }
    }
  }, [state.currentItem, gameState, lives, score, currentLevel, currentStreak, isFeverModeActive, handleGameOver, spawnNewTrash, startFeverMode]);


  // --- FUNCIONES DE CONTROL ---
  const startGame = useCallback(() => {
    // Limpia cualquier timer viejo
    clearInterval(itemTimerRef.current);
    clearInterval(powerUpTimerRef.current);
    clearInterval(feverSpawnRef.current);
    clearTimeout(feverDurationRef.current);

    initReciclajeAudio();
    dispatch({ type: 'START_GAME' });
    spawnNewTrash(); // Spawnea el primer item
  }, [spawnNewTrash]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') dispatch({ type: 'PAUSE' });
    else if (gameState === 'paused') dispatch({ type: 'RESUME' });
  }, [gameState]);

  const toggleMute = useCallback(() => {
    const muted = toggleMuteService();
    dispatch({ type: 'TOGGLE_MUTE', payload: muted });
  }, []);

  return { state, dispatch, startGame, togglePause, toggleMute, handleDrop };
};