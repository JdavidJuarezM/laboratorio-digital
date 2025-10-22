// client/src/components/Supermercado/hooks/useSupermercado.js
import { useReducer, useCallback, useEffect } from "react";
import { PRODUCTS, DIFFICULTY_SETTINGS } from "../constants/gameData";
import {
  initAudio,
  playSound,
  playSuccessSound,
  playErrorSound,
  playClickSound,
} from "../services/soundService";

const initialState = {
  gameState: "welcome",
  shoppingList: {},
  cart: {},
  currentQuestion: null,
  score: 0,
  highScore: parseInt(localStorage.getItem("supermercadoHighScore") || "0", 10),
  difficulty: "normal",
  isBudgetMode: false,
  budget: 0,
  budgetRemaining: 0,
  lifelineUsed: false,
  isModalOpen: false,
  message: { text: "", type: "" },
};

function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        gameState: "shopping",
        difficulty: action.payload.difficulty,
        isBudgetMode: action.payload.isBudgetMode,
        highScore: state.highScore,
        shoppingList: action.payload.shoppingList,
        budget: action.payload.budget,
        budgetRemaining: action.payload.budget,
      };
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };
    case "SET_BUDGET_MODE":
      return { ...state, isBudgetMode: action.payload };
    case "OPEN_QUESTION_MODAL":
      return { ...state, currentQuestion: action.payload, isModalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false, currentQuestion: null };
    case "ANSWER_CORRECT": {
      const { product, points } = action.payload;
      const newCart = {
        ...state.cart,
        [product.id]: { ...state.shoppingList[product.id] },
      };
      const newScore = state.score + points;
      const itemCost = product.price * state.shoppingList[product.id].quantity;
      return {
        ...state,
        cart: newCart,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        budgetRemaining: state.isBudgetMode
          ? state.budgetRemaining - itemCost
          : state.budgetRemaining,
      };
    }
    case "ADD_POINTS_AND_END": {
      const newScore = state.score + action.payload.points;
      return {
        ...state,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        gameState: "end",
      };
    }
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "CHECKOUT":
      return { ...state, gameState: "checkout" };
    default:
      return state;
  }
}

const useSupermercado = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    localStorage.setItem("supermercadoHighScore", state.highScore.toString());
  }, [state.highScore]);

  const showMessage = useCallback((text, type) => {
    dispatch({ type: "SET_MESSAGE", payload: { text, type } });
    setTimeout(
      () => dispatch({ type: "SET_MESSAGE", payload: { text: "", type: "" } }),
      2000
    );
  }, []);

  const startGame = useCallback(
    (options = {}) => {
      const { newDifficulty, newBudgetMode, forceRestart } = options;
      if (!forceRestart && state.gameState !== "welcome") return;

      if (state.gameState === "welcome") {
        initAudio();
      }
      playClickSound();

      const difficulty = newDifficulty || state.difficulty;
      const isBudgetMode =
        newBudgetMode !== null ? newBudgetMode : state.isBudgetMode;

      const settings = DIFFICULTY_SETTINGS[difficulty];
      if (!settings) {
        console.error(
          `Configuración de dificultad no encontrada para: ${difficulty}`
        );
        return;
      }
      const [min, max] = settings.items;
      const numItems = Math.floor(Math.random() * (max - min + 1)) + min;

      let availableProducts = [...PRODUCTS];
      const newShoppingList = {};
      for (let i = 0; i < numItems; i++) {
        if (availableProducts.length === 0) break;
        const productIndex = Math.floor(
          Math.random() * availableProducts.length
        );
        const product = availableProducts[productIndex];
        const quantity = 1 + Math.floor(Math.random() * 3);
        newShoppingList[product.id] = { ...product, quantity };
        availableProducts.splice(productIndex, 1);
      }

      let budget = 0;
      if (isBudgetMode) {
        const listTotal = Object.values(newShoppingList).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        budget = parseFloat((listTotal * 1.25).toFixed(2));
      }

      dispatch({
        type: "START_GAME",
        payload: {
          shoppingList: newShoppingList,
          budget,
          difficulty,
          isBudgetMode,
        },
      });
    },
    [state.difficulty, state.isBudgetMode, state.gameState]
  );

  const handleProductClick = useCallback(
    (product) => {
      const isListed = !!state.shoppingList[product.id];
      const isFull = !!state.cart[product.id];

      if (!isListed || isFull) {
        showMessage(
          isFull ? "¡Ya tienes suficientes!" : "No está en tu lista.",
          "blue"
        );
        playSound("C4", "8n");
        return;
      }

      if (state.isBudgetMode) {
        const itemCost =
          product.price * state.shoppingList[product.id].quantity;
        if (itemCost > state.budgetRemaining) {
          showMessage("¡No tienes suficiente presupuesto!", "red");
          playErrorSound();
          return;
        }
      }

      const { quantity: neededQuantity, price } =
        state.shoppingList[product.id];
      const itemCost = price * neededQuantity;
      const question = `Necesitas ${neededQuantity} ${
        product.name
      }. Si cada uno cuesta $${price.toFixed(2)}, ¿cuál es el costo total?`;
      const answer = parseFloat(itemCost.toFixed(2));

      dispatch({
        type: "OPEN_QUESTION_MODAL",
        payload: { product, question, answer, type: "multiplication" },
      });
    },
    [
      state.shoppingList,
      state.cart,
      state.isBudgetMode,
      state.budgetRemaining,
      showMessage,
    ]
  );

  const handleAnswerSubmit = useCallback(
    (userAnswer) => {
      if (!state.currentQuestion) return;
      const isCorrect = parseFloat(userAnswer) === state.currentQuestion.answer;

      if (isCorrect) {
        playSuccessSound();
        showMessage("¡Correcto!", "green");
        dispatch({
          type: "ANSWER_CORRECT",
          payload: { product: state.currentQuestion.product, points: 10 },
        });
        dispatch({ type: "CLOSE_MODAL" });
      } else {
        playErrorSound();
        showMessage("Incorrecto, ¡inténtalo de nuevo!", "red");
      }
    },
    [state.currentQuestion, showMessage]
  );

  const handleCheckout = useCallback(() => dispatch({ type: "CHECKOUT" }), []);

  const handleEndGame = useCallback((points) => {
    dispatch({ type: "ADD_POINTS_AND_END", payload: { points } });
  }, []);

  return {
    state,
    dispatch,
    startGame,
    handleProductClick,
    handleAnswerSubmit,
    handleCheckout,
    handleEndGame,
  };
};

export default useSupermercado;
