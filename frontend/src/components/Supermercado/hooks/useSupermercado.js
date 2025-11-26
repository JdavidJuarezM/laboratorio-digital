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
// Asegúrate de que este archivo exista en la ruta correcta
import { getHighScore, saveScore } from "../services/supermercadoService";

const initialState = {
  gameState: "welcome",
  shoppingList: {},
  cart: {},
  currentQuestion: null,
  score: 0,
  highScore: 0,
  streak: 0,
  difficulty: "normal",
  isBudgetMode: false,
  budget: 0,
  budgetRemaining: 0,
  lifelineUsed: false,
  isModalOpen: false,
  message: { text: "", type: "" },
};

// Función auxiliar corregida con llaves {} en los case
const generateQuestion = (product, quantity, difficulty) => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  // Selecciona un tipo de pregunta aleatorio permitido
  const type = settings.questions[Math.floor(Math.random() * settings.questions.length)];

  const totalCost = product.price * quantity;
  let questionText = "";
  let answer = 0;

  switch (type) {
    case "addition": {
      // AQUI AGREGUE LAS LLAVES { }
      const increase = Math.floor(Math.random() * 10) + 1;
      questionText = `El precio de ${product.name} subió $${increase}. Si costaba $${product.price}, ¿cuánto cuesta ahora uno solo?`;
      answer = parseFloat((product.price + increase).toFixed(2));
      break;
    }

    case "subtraction": {
      // AQUI AGREGUE LAS LLAVES { }
      const nextBill = Math.ceil(totalCost / 10) * 10 || 10;
      const payAmount = nextBill === totalCost ? nextBill + 20 : nextBill;
      questionText = `Vas a pagar $${totalCost.toFixed(2)} con un billete de $${payAmount}. ¿Cuánto cambio recibes?`;
      answer = parseFloat((payAmount - totalCost).toFixed(2));
      break;
    }

    case "percentage": {
      // AQUI AGREGUE LAS LLAVES { }
      const discounts = [10, 20, 50];
      const discount = discounts[Math.floor(Math.random() * discounts.length)];
      questionText = `¡Oferta! ${product.name} tiene un ${discount}% de descuento. El precio normal es $${product.price}. ¿Cuánto dinero te ahorras por unidad?`;
      answer = parseFloat((product.price * (discount / 100)).toFixed(2));
      break;
    }

    case "division": {
       // AQUI AGREGUE LAS LLAVES { }
       const friends = Math.floor(Math.random() * 3) + 2;
       questionText = `Compras ${quantity} ${product.name} por $${totalCost.toFixed(2)} y lo pagas entre ${friends} amigos en partes iguales. ¿Cuánto paga cada uno?`;
       answer = parseFloat((totalCost / friends).toFixed(2));
       break;
    }

    case "multiplication":
    default:
      // Este no necesita llaves porque no declara const/let nuevas
      questionText = `Necesitas ${quantity} ${product.name}. Si cada uno cuesta $${product.price.toFixed(2)}, ¿cuál es el costo total?`;
      answer = parseFloat(totalCost.toFixed(2));
      break;
  }

  return { question: questionText, answer, type, product };
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_HIGH_SCORE":
      return { ...state, highScore: action.payload };
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

      const streakBonus = Math.floor(state.streak / 3) * 5;
      const totalPoints = points + streakBonus;

      const newCart = {
        ...state.cart,
        [product.id]: { ...state.shoppingList[product.id] },
      };

      const newScore = state.score + totalPoints;
      const itemCost = product.price * state.shoppingList[product.id].quantity;

      return {
        ...state,
        cart: newCart,
        score: newScore,
        streak: state.streak + 1,
        highScore: Math.max(newScore, state.highScore),
        budgetRemaining: state.isBudgetMode
          ? state.budgetRemaining - itemCost
          : state.budgetRemaining,
      };
    }
    case "ANSWER_WRONG":
      return {
        ...state,
        streak: 0,
      };
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
    const fetchScore = async () => {
      const data = await getHighScore();
      if (data && data.highScore !== undefined) {
        dispatch({ type: "SET_HIGH_SCORE", payload: data.highScore });
      }
    };
    fetchScore();
  }, []);

  useEffect(() => {
    if (state.gameState === 'end' && state.score > 0) {
       saveScore(state.score).catch(err => console.error("Error guardando score:", err));
    }
  }, [state.score, state.gameState]);

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
        console.error(`Configuración no encontrada para dificultad: ${difficulty}`);
        return;
      }

      const [minProd, maxProd] = settings.items;
      const numProducts = Math.floor(Math.random() * (maxProd - minProd + 1)) + minProd;

      // Usamos quantityRange si existe, o un default [1, 3] por seguridad
      const [minQty, maxQty] = settings.quantityRange || [1, 3];

      let availableProducts = [...PRODUCTS];
      const newShoppingList = {};

      for (let i = 0; i < numProducts; i++) {
        if (availableProducts.length === 0) break;

        const productIndex = Math.floor(Math.random() * availableProducts.length);
        const product = availableProducts[productIndex];

        const quantity = Math.floor(Math.random() * (maxQty - minQty + 1)) + minQty;

        newShoppingList[product.id] = { ...product, quantity };
        availableProducts.splice(productIndex, 1);
      }

      let budget = 0;
      if (isBudgetMode) {
        const listTotal = Object.values(newShoppingList).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const margin = (difficulty === 'hard' || difficulty === 'extreme') ? 1.1 : 1.25;
        budget = parseFloat((listTotal * margin).toFixed(2));
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
        playSound("C3", "8n");
        return;
      }

      if (state.isBudgetMode) {
        const itemCost = product.price * state.shoppingList[product.id].quantity;
        if (itemCost > state.budgetRemaining) {
          showMessage("¡No tienes suficiente presupuesto!", "red");
          playErrorSound();
          return;
        }
      }

      const { quantity } = state.shoppingList[product.id];

      const questionData = generateQuestion(product, quantity, state.difficulty);

      dispatch({
        type: "OPEN_QUESTION_MODAL",
        payload: questionData,
      });
    },
    [
      state.shoppingList,
      state.cart,
      state.isBudgetMode,
      state.budgetRemaining,
      state.difficulty,
      showMessage,
    ]
  );

  const handleAnswerSubmit = useCallback(
    (userAnswer) => {
      if (!state.currentQuestion) return;

      const isCorrect = Math.abs(parseFloat(userAnswer) - state.currentQuestion.answer) < 0.05;

      if (isCorrect) {
        playSuccessSound();
        const streakMsg = state.streak >= 2 ? ` ¡Racha x${state.streak + 1}!` : "";
        showMessage("¡Correcto!" + streakMsg, "green");

        dispatch({
          type: "ANSWER_CORRECT",
          payload: { product: state.currentQuestion.product, points: 10 },
        });
        dispatch({ type: "CLOSE_MODAL" });
      } else {
        playErrorSound();
        showMessage("Incorrecto. La racha se reinicia.", "red");
        dispatch({ type: "ANSWER_WRONG" });
      }
    },
    [state.currentQuestion, state.streak, showMessage]
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