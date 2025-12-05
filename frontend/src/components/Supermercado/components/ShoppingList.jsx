// client/src/components/Supermercado/components/ShoppingList.jsx
import React from "react";

const ShoppingList = ({list, cart, onRestart, onShowInstructions}) => {
    const totalCost = Object.values(cart).reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <aside className="lg:col-span-1 bg-gray-50 rounded-2xl p-4 md:p-6 flex flex-col border-2 border-gray-200">
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-700 flex items-center">
                        {/* MODIFICADO: Emoji en lugar de SVG */}
                        <span
                            className="w-6 h-6 mr-2 text-2xl"
                            role="img"
                            aria-label="List"
                        >
              📋
            </span>
                        Lista
                    </h2>
                    <button
                        onClick={onShowInstructions}
                        className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition"
                        title="Instrucciones"
                    >
                        💡
                    </button>
                </div>
                <ul id="shopping-list" className="space-y-2 mt-4">
                    {Object.values(list).map((item) => (
                        <li
                            key={item.id}
                            className={`text-lg flex justify-between items-center bg-white p-2 rounded-lg transition-all ${
                                cart[item.id] ? "list-item-checked" : ""
                            }`}
                        >
              <span>
                {item.emoji} {item.name}{" "}
                  <span className="font-bold">x{item.quantity}</span>
              </span>
                            <span
                                className={`text-green-400 transition-opacity ${
                                    cart[item.id] ? "opacity-100" : "opacity-0"
                                }`}
                            >
                {/* MODIFICADO: Emoji en lugar de SVG */}
                                <span role="img" aria-label="Checked">
                  ✅
                </span>
              </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8">
                <h2
                    id="cart-title"
                    className="text-2xl font-bold text-slate-700 flex items-center"
                >
                    {/* MODIFICADO: Emoji en lugar de SVG */}
                    <span
                        className="w-6 h-6 mr-2 text-2xl"
                        role="img"
                        aria-label="Cart"
                    >
            🛒
          </span>
                    Carrito
                </h2>
                <div className="bg-white rounded-lg p-4 mt-4 border-2 border-gray-200 min-h-[100px]">
                    <ul id="cart-items" className="space-y-2">
                        {Object.values(cart).map((item) => (
                            <li
                                key={item.id}
                                className="text-lg cart-item-appear font-semibold text-slate-600"
                            >
                                {item.emoji} {item.name} x{item.quantity}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                        <p className="text-2xl font-black text-right text-gray-700">
                            Total:{" "}
                            <span id="total-cost" className="text-green-600">
                ${totalCost.toFixed(2)}
              </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-center">
                <button
                    id="restart-button"
                    className="btn bg-red-100 text-red-500 py-3 px-6 flex items-center justify-center w-full"
                    onClick={() => onRestart(null, null, true)} // Resetea completamente
                >
                    {/* MODIFICADO: Emoji en lugar de SVG */}
                    <span
                        className="w-5 h-5 mr-2 text-xl"
                        role="img"
                        aria-label="Restart"
                    >
            🔄
          </span>
                    Reiniciar
                </button>
            </div>
        </aside>
    );
};

export default ShoppingList;