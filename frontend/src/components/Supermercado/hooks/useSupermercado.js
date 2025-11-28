import { useReducer, useCallback, useEffect, useState } from "react";
// Importamos los productos locales que servirán de "Stock Base"
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

  // Cargar productos: Stock Local (50) + Base de Datos (Personalizados)
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Obtener productos personalizados de la BD
        const dbData = await getProductos();

        let customProducts = [];
        if (dbData && dbData.length > 0) {
          // Mapeamos y asignamos un ID alto para evitar conflictos con los IDs 1-50 locales
          customProducts = dbData.map(p => ({
            id: p.id + 10000, // ID Offset: 1 en BD será 10001 en el juego
            name: p.nombre,
            price: p.precio,
            emoji: p.emoji,
            categoria: p.categoria || "Personalizados"
          }));
        }

        // 2. Combinar: Stock Fijo + Personalizados
        // De esta forma siempre hay al menos 50 productos
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

      // Protección: Si por alguna razón products está vacío, recargar desde local
      let availableProducts = [...products];
      if (availableProducts.length === 0) {
         availableProducts = [...PRODUCTS];
      }

      const difficulty = newDifficulty || state.difficulty;
      const settings = DIFFICULTY_SETTINGS[difficulty];
      const [min, max] = settings ? settings.items : [3, 5];
      const numItems = Math.floor(Math.random() * (max - min + 1)) + min;

      const newShoppingList = {};
      const productsPool = [...availableProducts];

      for (let i = 0; i < numItems; i++) {
        if (productsPool.length === 0) break;
        const productIndex = Math.floor(Math.random() * productsPool.length);
        const product = productsPool[productIndex];
        const quantity = 1 + Math.floor(Math.random() * 3);
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

      const { quantity: neededQuantity, price } = state.shoppingList[product.id];
      const itemCost = price * neededQuantity;
      const question = `Necesitas ${neededQuantity} ${product.name}. Si cada uno cuesta $${price.toFixed(2)}, ¿cuánto es el total?`;
      const answer = parseFloat(itemCost.toFixed(2));

      dispatch({
        type: "OPEN_QUESTION_MODAL",
        payload: { product, question, answer, type: "multiplication" },
      });
    },
    [state.shoppingList, state.cart, showMessage]
  );

  const handleAnswerSubmit = useCallback(
    (userAnswer) => {
      if (!state.currentQuestion) return;
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