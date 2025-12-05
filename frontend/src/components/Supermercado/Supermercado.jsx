import React, {useState, useEffect} from "react";
import useSupermercado from "./hooks/useSupermercado"; // Recuperamos tu lógica original
import WelcomeModal from "./components/WelcomeModal";
import Header from "./components/Header"; // Recuperamos el Header con dificultad
import ShoppingList from "./components/ShoppingList"; // Recuperamos la lista y el carrito
import ProductGrid from "./components/ProductGrid";
import QuestionModal from "./components/QuestionModal"; // Recuperamos el modal de matemáticas
import FinalScreen from "./components/FinalScreen";
import PanelProductos from "./components/PanelProductos";
import "./Supermercado.css";

const Supermercado = () => {
    // 1. Usamos TU hook original que ya tiene toda la lógica del juego
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

    // Estados locales para paneles administrativos
    const [showManager, setShowManager] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    const MASTER_KEY = import.meta.env.VITE_TEACHER_CODE;

    // Efecto para verificar si se completó la lista (lógica original)
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
        if (adminPassword === MASTER_KEY) {
            setShowManager(true);
            setShowAdminLogin(false);
            setAdminPassword("");
        } else {
            alert("Clave incorrecta");
        }
    };

    // Renderizado condicional del Welcome Modal
    if (gameState === "welcome") {
        return <WelcomeModal onStart={() => startGame({forceRestart: true})}/>;
    }

    return (
        // ESTRUCTURA VISUAL NUEVA (Pantalla Completa)
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col relative overflow-hidden">

            {/* Fondo Decorativo */}
            <div
                className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div
                className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

            <canvas id="confetti-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"></canvas>

            {/* Botón de configuración (Admin) */}
            <button
                onClick={() => setShowAdminLogin(true)}
                className="absolute top-4 right-4 z-50 bg-white/50 hover:bg-white p-2 rounded-full shadow-sm transition-all"
                title="Panel Maestro"
            >
                ⚙️
            </button>

            {/* Contenedor Principal */}
            <div className="flex-1 w-full p-4 md:p-6 flex flex-col relative z-10 h-screen box-border">

                {/* HEADER ORIGINAL (Puntuación, Dificultad) adaptado al diseño nuevo */}
                <div className="mb-4">
                    <Header
                        score={score}
                        highScore={highScore}
                        difficulty={difficulty}
                        dispatch={dispatch}
                        onRestart={startGame}
                    />
                </div>

                {/* ÁREA DE JUEGO (Dos columnas: Lista/Carrito y Productos) */}
                <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">

                    {/* COLUMNA IZQUIERDA: Lista de Compras y Carrito */}
                    <aside className="w-full md:w-1/4 h-full flex flex-col min-h-0">
                        {/* Usamos tu componente ShoppingList original pero forzamos altura completa */}
                        <div
                            className="h-full bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden flex flex-col">
                            {/* Pasamos overflow-y-auto al contenedor interno de ShoppingList mediante CSS global o props si lo permite,
                    o confiamos en que tu componente ShoppingList ya maneja el scroll internamente */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <ShoppingList
                                    list={shoppingList}
                                    cart={cart}
                                    onRestart={startGame}
                                    onShowInstructions={() => setShowInstructions(true)}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* COLUMNA DERECHA: Estantes de Productos */}
                    <main
                        className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-inner p-4 md:p-6 flex flex-col min-h-0 relative">

                        {/* Mensajes de Feedback (Flotante) */}
                        <div
                            aria-live="polite"
                            className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-20 px-6 py-2 rounded-full font-bold text-lg shadow-lg transition-all duration-300 ${
                                message.text ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                            } ${
                                message.type === "red" ? "bg-red-100 text-red-600 border border-red-200" :
                                    message.type === "green" ? "bg-green-100 text-green-600 border border-green-200" :
                                        "bg-blue-100 text-blue-600 border border-blue-200"
                            }`}
                        >
                            {message.text}
                        </div>

                        {/* Barra de Progreso Visual */}
                        <div
                            className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden border border-gray-300 shrink-0">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                style={{
                                    width: `${Object.keys(shoppingList).length > 0 ? (Object.keys(cart).length / Object.keys(shoppingList).length) * 100 : 0}%`,
                                }}
                            ></div>
                        </div>

                        {/* Grid de Productos Scrollable */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {loadingProducts ? (
                                <div
                                    className="flex items-center justify-center h-full text-gray-500 font-bold text-xl animate-pulse">
                                    📦 Cargando productos...
                                </div>
                            ) : gameState === "shopping" ? (
                                <ProductGrid
                                    products={products}
                                    collectedIds={Object.keys(cart).map((id) => parseInt(id))}
                                    onProductClick={handleProductClick}
                                />
                            ) : (
                                <FinalScreen score={score} cart={cart} onEndGame={handleEndGame}/>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* --- MODALES (Lógica Original) --- */}

            {/* Modal de Pregunta Matemática */}
            {isModalOpen && (
                <QuestionModal
                    questionData={currentQuestion}
                    onSubmit={handleAnswerSubmit}
                    onClose={() => dispatch({type: "CLOSE_MODAL"})}
                />
            )}

            {/* Modal de Instrucciones */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl max-w-md text-center shadow-2xl animate-bounce-in">
                        <h2 className="text-3xl font-black text-blue-600 mb-4">📖 Misión</h2>
                        <ul className="text-left space-y-3 mb-8 text-gray-700 text-lg">
                            <li className="flex items-start gap-2"><span className="text-xl">📋</span> Mira tu lista de
                                compras a la izquierda.
                            </li>
                            <li className="flex items-start gap-2"><span className="text-xl">🔍</span> Encuentra los
                                productos en los estantes.
                            </li>
                            <li className="flex items-start gap-2"><span className="text-xl">🧮</span> Resuelve la
                                operación matemática.
                            </li>
                            <li className="flex items-start gap-2"><span className="text-xl">💰</span> ¡Completa la lista
                                y paga en caja!
                            </li>
                        </ul>
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
                        >
                            ¡Entendido!
                        </button>
                    </div>
                </div>
            )}

            {/* Login de Admin */}
            {showAdminLogin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Acceso Maestro</h3>
                        <form onSubmit={handleAdminAccess} className="space-y-4">
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 outline-none transition-colors"
                                placeholder="Contraseña..."
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowAdminLogin(false)}
                                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancelar
                                </button>
                                <button type="submit"
                                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-colors">Entrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Panel de Gestión */}
            {showManager && (
                <PanelProductos onClose={() => {
                    setShowManager(false);
                    window.location.reload();
                }}/>
            )}
        </div>
    );
};

export default Supermercado;
