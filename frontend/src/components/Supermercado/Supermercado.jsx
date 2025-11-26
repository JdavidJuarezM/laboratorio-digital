// client/src/components/Supermercado/Supermercado.jsx
// client/src/components/Supermercado/Supermercado.jsx
import React, { useEffect } from "react";
import useSupermercado from "./hooks/useSupermercado";
import WelcomeModal from "./components/WelcomeModal";
import Header from "./components/Header";
import ShoppingList from "./components/ShoppingList";
import ProductGrid from "./components/ProductGrid";
import QuestionModal from "./components/QuestionModal";
import FinalScreen from "./components/FinalScreen";
import { PRODUCTS } from "./constants/gameData";
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
  } = useSupermercado();

  const {
    gameState,
    score,
    highScore,
    difficulty,
    isBudgetMode,
    budgetRemaining,
    shoppingList,
    cart,
    currentQuestion,
    isModalOpen,
    lifelineUsed,
    message,
  } = state;

  useEffect(() => {
    const listCompleted =
      Object.keys(shoppingList).length > 0 &&
      Object.keys(shoppingList).length === Object.keys(cart).length;
    if (gameState === "shopping" && listCompleted) {
      handleCheckout();
    }
  }, [cart, shoppingList, gameState, handleCheckout]);

  if (gameState === "welcome") {
    return <WelcomeModal onStart={() => startGame({ forceRestart: true })} />;
  }

  return (
    // CAMBIO AQUÍ: max-w-6xl -> max-w-[98%] para usar casi todo el ancho
    <div id="game-wrapper" className="w-full max-w-[98%] mx-auto opacity-100 h-full flex flex-col">
      <canvas
        id="confetti-canvas"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      ></canvas>

      <div
        id="game-container"
        // Ajuste de padding y altura mínima
        className="w-full bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex-grow flex flex-col"
      >
        <Header
          score={score}
          highScore={highScore}
          difficulty={difficulty}
          dispatch={dispatch}
          isBudgetMode={isBudgetMode}
          budgetRemaining={budgetRemaining}
          onRestart={startGame}
        />

        {/* Layout Grid ajustado: La lista ocupa 1 columna, el panel principal ocupa el resto (3 o 4 columnas) */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 flex-grow">

          {/* La lista de compras (ShoppingList) */}
          <div className="lg:col-span-1 h-full">
             <ShoppingList
              list={shoppingList}
              cart={cart}
              onRestart={() => startGame({ forceRestart: true })}
              lifelineUsed={lifelineUsed}
              onUseLifeline={() => {
                /* Lógica del comodín */
              }}
            />
          </div>

          {/* Panel principal (Barra de progreso + Productos) */}
          <section id="main-panel" className="lg:col-span-3 flex flex-col">
            <div
              aria-live="polite"
              className={`h-10 mb-2 text-center text-xl font-bold message-active ${
                message.type === "red"
                  ? "text-red-500"
                  : message.type === "green"
                  ? "text-green-600"
                  : "text-blue-500"
              }`}
            >
              {message.text}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden border border-gray-300">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${
                    Object.keys(shoppingList).length > 0
                      ? (Object.keys(cart).length /
                          Object.keys(shoppingList).length) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>

            {gameState === "shopping" && (
              <ProductGrid
                products={PRODUCTS}
                collectedIds={Object.keys(cart).map((id) => parseInt(id))}
                onProductClick={handleProductClick}
              />
            )}
            {(gameState === "checkout" || gameState === "end") && (
              <FinalScreen
                score={score}
                cart={cart}
                onEndGame={handleEndGame}
              />
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
    </div>
  );
};

export default Supermercado;
