import React, { useEffect, useState } from "react";
import useSupermercado from "./hooks/useSupermercado";
import WelcomeModal from "./components/WelcomeModal";
import Header from "./components/Header";
import ShoppingList from "./components/ShoppingList";
import ProductGrid from "./components/ProductGrid";
import QuestionModal from "./components/QuestionModal";
import FinalScreen from "./components/FinalScreen";
import PanelProductos from "./components/PanelProductos";
import "./Supermercado.css";

const Supermercado = () => {
  const {
    state,
    dispatch,
    startGame,
    handleProductClick,
    handleAnswerSubmit,
    handleCheckout,
    handleEndGame,
    products,
    loadingProducts
  } = useSupermercado();

  const {
    gameState,
    score,
    highScore,
    difficulty,
    shoppingList,
    cart,
    currentQuestion,
    isModalOpen,
    message,
  } = state;

  const [showManager, setShowManager] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Obtener clave maestra desde variable de entorno o usar fallback
  const MASTER_KEY = import.meta.env.VITE_TEACHER_CODE;

  useEffect(() => {
    const listCompleted =
      Object.keys(shoppingList).length > 0 &&
      Object.keys(shoppingList).length === Object.keys(cart).length;
    if (gameState === "shopping" && listCompleted) {
      handleCheckout();
    }
  }, [cart, shoppingList, gameState, handleCheckout]);

  const handleAdminAccess = (e) => {
    e.preventDefault();
    // Validación usando la variable de entorno
    if (adminPassword === MASTER_KEY) {
      setShowManager(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Clave incorrecta");
    }
  };

  if (gameState === "welcome") {
    return <WelcomeModal onStart={() => startGame({ forceRestart: true })} />;
  }

  return (
    <div id="game-wrapper" className="w-full max-w-6xl mx-auto opacity-100 relative">
      <canvas id="confetti-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"></canvas>

      <button
        onClick={() => setShowAdminLogin(true)}
        className="absolute top-0 right-0 m-4 text-xs text-gray-400 hover:text-purple-600 z-40 font-bold"
      >
        ⚙️
      </button>

      <div id="game-container" className="w-full bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8">
        <Header
          score={score}
          highScore={highScore}
          difficulty={difficulty}
          dispatch={dispatch}
          onRestart={startGame}
        />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <ShoppingList
            list={shoppingList}
            cart={cart}
            onRestart={startGame}
            onShowInstructions={() => setShowInstructions(true)}
          />

          <section id="main-panel" className="lg:col-span-2">
            <div
              aria-live="polite"
              className={`h-10 mb-2 text-center text-xl font-bold message-active ${
                message.type === "red" ? "text-red-500" : message.type === "green" ? "text-green-600" : "text-blue-500"
              }`}
            >
              {message.text}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden border border-gray-300">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${Object.keys(shoppingList).length > 0 ? (Object.keys(cart).length / Object.keys(shoppingList).length) * 100 : 0}%`,
                }}
              ></div>
            </div>

            {loadingProducts ? (
              <div className="text-center p-10">Cargando productos...</div>
            ) : gameState === "shopping" ? (
              <ProductGrid
                products={products}
                collectedIds={Object.keys(cart).map((id) => parseInt(id))}
                onProductClick={handleProductClick}
              />
            ) : (
              <FinalScreen score={score} cart={cart} onEndGame={handleEndGame} />
            )}
          </section>
        </main>
      </div>

      {isModalOpen && (
        <QuestionModal
          questionData={currentQuestion}
          onSubmit={handleAnswerSubmit}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        />
      )}

      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">📖 Cómo Jugar</h2>
            <ul className="text-left space-y-2 mb-6 text-gray-700">
              <li>1. Mira tu <strong>Lista de Compras</strong> a la izquierda.</li>
              <li>2. Busca los productos en los estantes.</li>
              <li>3. Haz clic en el producto correcto.</li>
              <li>4. Resuelve el problema matemático.</li>
              <li>5. ¡Completa la lista para ir a pagar!</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">Entendido</button>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-xl font-bold mb-4">Acceso Maestro</h3>
            <form onSubmit={handleAdminAccess}>
              <input type="password" value={adminPassword} onChange={(e)=>setAdminPassword(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Contraseña" autoFocus />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setShowAdminLogin(false)} className="text-gray-500">Cancelar</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Entrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showManager && (
        <PanelProductos onClose={() => { setShowManager(false); window.location.reload(); }} />
      )}
    </div>
  );
};

export default Supermercado;Supermercado;
