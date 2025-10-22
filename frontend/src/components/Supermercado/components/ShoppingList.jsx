// client/src/components/Supermercado/components/ShoppingList.jsx
import React from "react";

const ShoppingList = ({
  list,
  cart,
  onRestart,
  lifelineUsed,
  onUseLifeline,
}) => {
  const totalCost = Object.values(cart).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <aside className="lg:col-span-1 bg-gray-50 rounded-2xl p-4 md:p-6 flex flex-col border-2 border-gray-200">
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            Lista
          </h2>
          <button
            id="lifeline-btn"
            className="btn bg-yellow-200 text-yellow-700 p-3"
            title="Usar comodín"
            onClick={onUseLifeline}
            disabled={lifelineUsed}
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
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
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
          <svg
            className="w-6 h-6 mr-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
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
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h5M20 20v-5h-5M4 4l16 16"
            ></path>
          </svg>
          Reiniciar
        </button>
      </div>
    </aside>
  );
};

export default ShoppingList;
