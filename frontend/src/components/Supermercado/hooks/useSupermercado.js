import { useReducer, useCallback, useEffect, useState } from "react";
import { PRODUCTS, DIFFICULTY_SETTINGS } from "../constants/gameData";
import { getProductos } from "../../../services/productosService";
import {
  initAudio,
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playSound,
} from "../services/soundService";

const initialState = {
  gameState: "welcome",
  shoppingList: {},
  cart: {},
  currentQuestion: null,
  score: 0,
  highScore: parseInt(localStorage.getItem("supermercadoHighScore") || "0", 10),
  difficulty: "normal",
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
        highScore: state.highScore,
        shoppingList: action.payload.shoppingList,
      };
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };
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
      return {
        ...state,
        cart: newCart,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
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
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cargar productos
  useEffect(() => {
    const loadData = async () => {
      try {
        const dbData = await getProductos();
        let customProducts = [];
        if (dbData && dbData.length > 0) {
          customProducts = dbData.map(p => ({
            id: p.id + 10000,
            name: p.nombre,
            price: p.precio,
            emoji: p.emoji,
            categoria: p.categoria || "Personalizados"
          }));
        }
        setProducts([...PRODUCTS, ...customProducts]);
      } catch (error) {
        console.error("Error conectando con API, usando solo stock local:", error);
        setProducts(PRODUCTS);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadData();
  }, []);

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
      const { newDifficulty, forceRestart } = options;
      if (!forceRestart && state.gameState !== "welcome") return;

      if (state.gameState === "welcome") initAudio();
      playClickSound();

      let availableProducts = [...products];
      if (availableProducts.length === 0) {
         availableProducts = [...PRODUCTS];
      }

      const difficulty = newDifficulty || state.difficulty;
      const settings = DIFFICULTY_SETTINGS[difficulty];
      const [min, max] = settings ? settings.items : [3, 5];
      const qtyRange = settings ? settings.quantityRange : [1, 3];

      const numItems = Math.floor(Math.random() * (max - min + 1)) + min;
      const newShoppingList = {};
      const productsPool = [...availableProducts];

      for (let i = 0; i < numItems; i++) {
        if (productsPool.length === 0) break;
        const productIndex = Math.floor(Math.random() * productsPool.length);
        const product = productsPool[productIndex];

        // Cantidad basada en la dificultad
        const quantity = Math.floor(Math.random() * (qtyRange[1] - qtyRange[0] + 1)) + qtyRange[0];

        newShoppingList[product.id] = { ...product, quantity };
        productsPool.splice(productIndex, 1);
      }

      dispatch({
        type: "START_GAME",
        payload: {
          shoppingList: newShoppingList,
          difficulty,
        },
      });
    },
    [state.difficulty, state.gameState, products]
  );

  const handleProductClick = useCallback(
    (product) => {
      const isListed = !!state.shoppingList[product.id];
      const isFull = !!state.cart[product.id];

      if (!isListed || isFull) {
        showMessage(isFull ? "¡Ya lo tienes!" : "No está en tu lista.", "blue");
        playSound("C4", "8n");
        return;
      }

      const { quantity, price } = state.shoppingList[product.id];

      // Lógica de Preguntas según Dificultad
      const settings = DIFFICULTY_SETTINGS[state.difficulty];
      const allowedTypes = settings ? settings.questions : ["multiplication"];
      const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

      let question = "";
      let answer = 0;

      switch (type) {
        case "addition": {
          const extra = Math.floor(Math.random() * 5) + 1; // Un pequeño cargo extra
          question = `El precio es $${price.toFixed(2)}. Si te cobran $${extra} por el empaque, ¿cuánto pagas por una unidad?`;
          answer = price + extra;
          break;
        }
        case "subtraction": {
          const discount = Math.floor(Math.random() * (price / 2)) + 1;
          question = `El precio es $${price.toFixed(2)}. Tienes un cupón de $${discount}. ¿Cuánto pagas por una unidad?`;
          answer = price - discount;
          break;
        }
        case "multiplication": {
          question = `Necesitas ${quantity} unidades de ${product.name}. Si cada una cuesta $${price.toFixed(2)}, ¿cuál es el total?`;
          answer = price * quantity;
          break;
        }
        case "division": {
          // Generamos el total para que el usuario encuentre el unitario
          const totalDiv = price * quantity;
          question = `Pagaste $${totalDiv.toFixed(2)} por ${quantity} unidades de ${product.name}. ¿Cuánto costó cada una?`;
          answer = price;
          break;
        }
        case "percentage": {
          const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
          const discountAmount = (price * percent) / 100;
          question = `El precio es $${price.toFixed(2)}. Hoy tiene un ${percent}% de descuento. ¿Cuánto dinero te ahorras por unidad?`;
          answer = discountAmount;
          break;
        }
        default:
          question = `¿Cuánto es ${price} x ${quantity}?`;
          answer = price * quantity;
      }

      dispatch({
        type: "OPEN_QUESTION_MODAL",
        payload: { product, question, answer: parseFloat(answer.toFixed(2)), type },
      });
    },
    [state.shoppingList, state.cart, showMessage, state.difficulty]
  );

  const handleAnswerSubmit = useCallback(
    (userAnswer) => {
      if (!state.currentQuestion) return;
      // Margen de error pequeño para flotantes
      const isCorrect = Math.abs(parseFloat(userAnswer) - state.currentQuestion.answer) < 0.1;

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
        showMessage("Incorrecto, intenta de nuevo.", "red");
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
    products: products.length > 0 ? products : PRODUCTS,
    loadingProducts
  };
};

export default useSupermercado;