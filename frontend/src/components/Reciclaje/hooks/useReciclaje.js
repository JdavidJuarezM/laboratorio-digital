// javascript
// file: `frontend/src/components/Reciclaje/hooks/useReciclaje.js`
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
} from '../constants.js';

import {
  initReciclajeAudio,
  playSound,
  toggleMute as toggleMuteService,
  pauseMusic,
  resumeMusic,
  stopBackgroundMusic
} from '../soundService.js';

import { getHighScore, saveHighScore } from '../reciclajeService.js';

const initialState = {
  gameState: 'welcome',
  score: 0,
  highScore: 0,
  lives: INITIAL_LIVES,
  currentStreak: 0,
  currentLevel: 1,
  currentItem: null,
  timerSpeed: 100,
  itemTimeDuration: 10000,
  itemTimerFill: 100,
  isDoublePointsActive: false,
  isFeverModeActive: false,
  powerUpTimeLeft: 0,
  isMuted: false,
  botMessage: '¡A reciclar!',
  botExpression: 'normal',
  gameStats: {
    itemsCorrect: 0,
    powerUpsCollected: 0,
    bombsAvoided: 0,
  },
  screenFlash: false,
};

function gameReducer(state, action) {
  const payload = action.payload ?? {};
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        gameState: 'playing',
        highScore: state.highScore,
        isMuted: state.isMuted,
        botMessage: '¡Empieza la misión!',
      };
    case 'GAME_OVER':
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
      return {
        ...state,
        gameState: 'paused',
        botExpression: 'paused',
      };
    case 'RESUME':
      return {
        ...state,
        gameState: 'playing',
        botExpression: 'normal',
      };
    case 'SET_HIGH_SCORE':
      return { ...state, highScore: payload };
    case 'SPAWN_ITEM':
      return {
        ...state,
        currentItem: payload,
        itemTimerFill: 100,
      };
    case 'ITEM_TIMER_TICK': {
      const decrement = 100 / (state.itemTimeDuration / state.timerSpeed);
      const newFill = state.itemTimerFill - decrement;
      return {
        ...state,
        itemTimerFill: Math.max(0, newFill),
      };
    }
    case 'POWERUP_TIMER_TICK': {
      const decrement = 100 * (100 / POWERUP_DURATION);
      const newPowerUpTime = state.powerUpTimeLeft - decrement;
      return {
        ...state,
        powerUpTimeLeft: Math.max(0, newPowerUpTime),
      };
    }
    case 'HANDLE_CORRECT': {
      const pts = payload.points ?? 0;
      return {
        ...state,
        score: state.score + pts,
        currentStreak: state.currentStreak + 1,
        currentItem: null,
        botMessage: payload.message ?? '',
        botExpression: 'happy',
        gameStats: {
          ...state.gameStats,
          itemsCorrect: state.gameStats.itemsCorrect + 1,
        },
      };
    }
    case 'HANDLE_WRONG': {
      return {
        ...state,
        lives: state.lives - 1,
        currentStreak: 0,
        currentItem: null,
        botMessage: payload.message ?? '¡Error!',
        botExpression: 'sad',
      };
    }
    case 'HANDLE_BOMB_AVOIDED': {
      const pts = payload.points ?? 0;
      return {
        ...state,
        score: state.score + pts,
        currentItem: null,
        botMessage: '¡Bomba evitada!',
        botExpression: 'happy',
        gameStats: {
          ...state.gameStats,
          bombsAvoided: state.gameStats.bombsAvoided + 1,
        },
      };
    }
    case 'LEVEL_UP': {
      const { name, speed, duration } = payload ?? {};
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        timerSpeed: speed ?? state.timerSpeed,
        itemTimeDuration: duration ?? state.itemTimeDuration,
        botMessage: `¡${name ?? 'Nivel'} alcanzado!`,
        screenFlash: true,
      };
    }
    case 'FLASH_OFF':
      return { ...state, screenFlash: false };
    case 'SET_BOT_MESSAGE':
      return { ...state, botMessage: payload ?? '' };
    case 'SET_BOT_EXPRESSION':
      return { ...state, botExpression: payload ?? 'normal' };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: payload }; // expects boolean
    case 'ACTIVATE_POWERUP': {
      const { subType } = payload;
      return {
        ...state,
        lives: subType === 'life' ? Math.min(state.lives + 1, INITIAL_LIVES) : state.lives,
        timerSpeed: subType === 'slowmo' ? state.timerSpeed * 2 : state.timerSpeed,
        isDoublePointsActive: subType === 'doublePoints' ? true : state.isDoublePointsActive,
        powerUpTimeLeft: subType !== 'life' ? 100 : state.powerUpTimeLeft,
        gameStats: {
          ...state.gameStats,
          powerUpsCollected: state.gameStats.powerUpsCollected + 1,
        },
        currentItem: null,
      };
    }
    case 'DEACTIVATE_POWERUP': {
      const idx = Math.max(0, state.currentLevel - 2);
      const currentLevelSpeed = (levels && levels[idx] && levels[idx].speed) ? levels[idx].speed : 100;
      return {
        ...state,
        timerSpeed: currentLevelSpeed,
        isDoublePointsActive: false,
        powerUpTimeLeft: 0,
      };
    }
    case 'START_FEVER_MODE':
      return {
        ...state,
        isFeverModeActive: true,
        currentStreak: 0,
        botMessage: '¡MODO RACHA!',
        powerUpTimeLeft: 100,
      };
    case 'END_FEVER_MODE':
      return {
        ...state,
        isFeverModeActive: false,
        botMessage: '¡Racha terminada!',
        powerUpTimeLeft: 0,
        currentItem: null,
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
    timerSpeed,
  } = state;

  const itemTimerRef = useRef(null);
  const powerUpTimerRef = useRef(null);
  const feverSpawnRef = useRef(null);
  const feverDurationRef = useRef(null);
  const botMessageRef = useRef(null);
  const botExpressionRef = useRef(null);

  // Ref for drag-and-drop current dragging item
  const draggingItemRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadScore = async () => {
      try {
        const data = await getHighScore();
        if (!mounted) return;
        dispatch({ type: 'SET_HIGH_SCORE', payload: data.highScore ?? 0 });
      } catch (e) {
        console.error("No se pudo cargar el high score", e);
        const savedScore = localStorage.getItem('recycleHighScore') || 0;
        if (!mounted) return;
        dispatch({ type: 'SET_HIGH_SCORE', payload: parseInt(savedScore, 10) });
      }
    };
    loadScore();
    return () => { mounted = false; };
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

  const setBotMessage = useCallback((message, duration = 2000) => {
    if (botMessageRef.current) clearTimeout(botMessageRef.current);
    dispatch({ type: 'SET_BOT_MESSAGE', payload: message });
    botMessageRef.current = setTimeout(() => {
      dispatch({ type: 'SET_BOT_MESSAGE', payload: '' });
      botMessageRef.current = null;
    }, duration);
  }, []);

  const setBotExpression = useCallback((expression, duration = 1500) => {
    if (botExpressionRef.current) clearTimeout(botExpressionRef.current);
    dispatch({ type: 'SET_BOT_EXPRESSION', payload: expression });
    botExpressionRef.current = setTimeout(() => {
      dispatch({ type: 'SET_BOT_EXPRESSION', payload: 'normal' });
      botExpressionRef.current = null;
    }, duration);
  }, []);

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

    if (item?.type === 'powerup') playSound('powerup-spawn');
    if (item?.type === 'danger') playSound('bomb-spawn');

    dispatch({ type: 'SPAWN_ITEM', payload: item });
  }, [isFeverModeActive]);

  useEffect(() => {
    if (gameState === 'paused') {
      pauseMusic();
    } else if (gameState === 'playing') {
      resumeMusic();
    } else if (gameState === 'gameOver') {
      stopBackgroundMusic();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && !isFeverModeActive) {
      if (itemTimerRef.current) clearInterval(itemTimerRef.current);
      itemTimerRef.current = setInterval(() => {
        dispatch({ type: 'ITEM_TIMER_TICK' });
      }, timerSpeed);
    } else {
      if (itemTimerRef.current) {
        clearInterval(itemTimerRef.current);
        itemTimerRef.current = null;
      }
    }
    return () => {
      if (itemTimerRef.current) {
        clearInterval(itemTimerRef.current);
        itemTimerRef.current = null;
      }
    };
  }, [gameState, timerSpeed, isFeverModeActive]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (itemTimerFill <= 0) {
      if (state.currentItem?.type === 'danger') {
        const points = isDoublePointsActive ? 50 : 25;
        dispatch({ type: 'HANDLE_BOMB_AVOIDED', payload: { points } });
        playSound('correct');
      } else {
        dispatch({ type: 'HANDLE_WRONG', payload: { message: '¡Se escapó!' } });
        playSound('error');
        setBotExpression('sad', 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemTimerFill, gameState, isDoublePointsActive]);

  useEffect(() => {
    if (gameState === 'playing' && powerUpTimeLeft > 0) {
      if (powerUpTimerRef.current) clearInterval(powerUpTimerRef.current);
      powerUpTimerRef.current = setInterval(() => {
        dispatch({ type: 'POWERUP_TIMER_TICK' });
      }, 100);
    } else {
      if (powerUpTimerRef.current) {
        clearInterval(powerUpTimerRef.current);
        powerUpTimerRef.current = null;
      }
    }
    return () => {
      if (powerUpTimerRef.current) {
        clearInterval(powerUpTimerRef.current);
        powerUpTimerRef.current = null;
      }
    };
  }, [gameState, powerUpTimeLeft]);

  useEffect(() => {
    if (powerUpTimeLeft <= 0 && (isDoublePointsActive || timerSpeed > 100)) {
      if (!isFeverModeActive) {
        dispatch({ type: 'DEACTIVATE_POWERUP' });
        setBotMessage('¡Poder terminado!', 2000);
      }
    }
  }, [powerUpTimeLeft, isDoublePointsActive, timerSpeed, isFeverModeActive, setBotMessage]);

  const startFeverMode = useCallback(() => {
    dispatch({ type: 'START_FEVER_MODE' });
    playSound('levelUp');

    if (itemTimerRef.current) {
      clearInterval(itemTimerRef.current);
      itemTimerRef.current = null;
    }

    if (feverSpawnRef.current) clearInterval(feverSpawnRef.current);
    feverSpawnRef.current = setInterval(() => {
      playSound('correct');
      const points = isDoublePointsActive ? 10 : 5;
      dispatch({ type: 'HANDLE_CORRECT', payload: { points, message: '¡FIEBRE!' } });
      setTimeout(spawnNewTrash, 300);
    }, FEVER_MODE_SPAWN_INTERVAL);

    if (feverDurationRef.current) clearTimeout(feverDurationRef.current);
    feverDurationRef.current = setTimeout(() => {
      if (feverSpawnRef.current) {
        clearInterval(feverSpawnRef.current);
        feverSpawnRef.current = null;
      }
      dispatch({ type: 'END_FEVER_MODE' });
      spawnNewTrash();
    }, FEVER_MODE_DURATION);
  }, [isDoublePointsActive, spawnNewTrash]);

  const handleDrop = useCallback((item, bin) => {
    if (!item || !bin) {
      console.error("handleDrop fue llamado con argumentos inválidos:", item, bin);
      return;
    }
    if (gameState !== 'playing' || !item) return;

    if (itemTimerRef.current) {
      clearInterval(itemTimerRef.current);
      itemTimerRef.current = null;
    }

    if (item.type === 'danger') {
      dispatch({ type: 'HANDLE_WRONG', payload: { message: '¡BOOM! ¡Era una bomba!' } });
      playSound('bomb-explode');
      setBotExpression('sad', 2000);
    } else if (item.type === bin.id) {
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
    } else if (item.type === 'powerup') {
      const points = isDoublePointsActive ? 10 : 5;
      dispatch({ type: 'HANDLE_CORRECT', payload: { points, message: `+${points}` } });
      dispatch({ type: 'ACTIVATE_POWERUP', payload: item });
      setBotMessage(`¡${item.name} activado!`, 2000);
      setBotExpression('happy', 1500);
    } else {
      dispatch({ type: 'HANDLE_WRONG', payload: { message: '¡Contenedor incorrecto!' } });
      playSound('error');
      setBotExpression('sad', 2000);
    }
  }, [gameState, isDoublePointsActive, currentStreak, setBotExpression, setBotMessage]);

  useEffect(() => {
    if (state.currentItem === null && gameState === 'playing') {
      if (lives <= 0) {
        handleGameOver();
        return;
      }

      const nextLevelData = levels && levels[currentLevel - 1];
      if (nextLevelData && score >= nextLevelData.score) {
        dispatch({ type: 'LEVEL_UP', payload: nextLevelData });
        playSound('levelUp');
        setTimeout(() => dispatch({ type: 'FLASH_OFF' }), 500);
      }

      if (currentStreak >= FEVER_MODE_STREAK_TARGET && !isFeverModeActive) {
        startFeverMode();
      } else if (!isFeverModeActive) {
        setTimeout(spawnNewTrash, 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentItem, gameState, lives, score, currentLevel, currentStreak, isFeverModeActive]);

  const startGame = useCallback(() => {
    if (itemTimerRef.current) {
      clearInterval(itemTimerRef.current);
      itemTimerRef.current = null;
    }
    if (powerUpTimerRef.current) {
      clearInterval(powerUpTimerRef.current);
      powerUpTimerRef.current = null;
    }
    if (feverSpawnRef.current) {
      clearInterval(feverSpawnRef.current);
      feverSpawnRef.current = null;
    }
    if (feverDurationRef.current) {
      clearTimeout(feverDurationRef.current);
      feverDurationRef.current = null;
    }

    initReciclajeAudio();
    dispatch({ type: 'START_GAME' });
    spawnNewTrash();
  }, [spawnNewTrash]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') dispatch({ type: 'PAUSE' });
    else if (gameState === 'paused') dispatch({ type: 'RESUME' });
  }, [gameState]);

  const toggleMute = useCallback(() => {
    const muted = toggleMuteService();
    dispatch({ type: 'TOGGLE_MUTE', payload: muted });
  }, []);

  // Drag-and-drop helpers to use from the component
  const onDragStart = useCallback((e, item) => {
    // Prefer storing object in ref; dataTransfer used only as fallback for external tooling
    draggingItemRef.current = item;
    try {
      e?.dataTransfer?.setData('text/plain', item?.id ?? '');
    } catch (err) {
      // ignore for complex objects
    }
  }, []);

  const onDragEnd = useCallback(() => {
    draggingItemRef.current = null;
  }, []);

  const onBinDragOver = useCallback((e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
  }, []);

  const onBinDrop = useCallback((e, bin) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const item = draggingItemRef.current;
    handleDrop(item, bin);
    draggingItemRef.current = null;
  }, [handleDrop]);

  const getDraggingItem = useCallback(() => draggingItemRef.current, []);

  useEffect(() => {
    return () => {
      if (itemTimerRef.current) clearInterval(itemTimerRef.current);
      if (powerUpTimerRef.current) clearInterval(powerUpTimerRef.current);
      if (feverSpawnRef.current) clearInterval(feverSpawnRef.current);
      if (feverDurationRef.current) clearTimeout(feverDurationRef.current);
      if (botMessageRef.current) clearTimeout(botMessageRef.current);
      if (botExpressionRef.current) clearTimeout(botExpressionRef.current);
    };
  }, []);

  return {
    state,
    dispatch,
    startGame,
    togglePause,
    toggleMute,
    handleDrop,
    onDragStart,
    onDragEnd,
    onBinDragOver,
    onBinDrop,
    getDraggingItem,
  };
};
