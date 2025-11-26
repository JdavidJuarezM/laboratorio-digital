// client/src/components/Supermercado/components/FinalScreen.jsx
import React, { useState, useMemo, useEffect } from "react";
import { playSuccessSound, playErrorSound } from "../services/soundService";

const FinalScreen = ({ score, cart, onEndGame }) => {
  const [changeInput, setChangeInput] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // useMemo para calcular los valores solo cuando el carrito cambia
  const { total, paymentBill, correctChange } = useMemo(() => {
    const total = Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const bills = [10, 20, 50, 100, 200].filter((b) => b > total);
    let paymentBill =
      bills.length > 0 ? bills[0] : Math.ceil(total / 10) * 10 + 10;
    if (paymentBill <= total) paymentBill = Math.ceil(total) + 1;
    const correctChange = parseFloat((paymentBill - total).toFixed(2));
    return { total, paymentBill, correctChange };
  }, [cart]);

  const handleSubmitChange = (e) => {
    e.preventDefault();
    if (parseFloat(changeInput) === correctChange) {
      playSuccessSound();
      onEndGame(25); // Puntos extra por pagar correctamente
      setIsPaid(true);
    } else {
      playErrorSound();
      setChangeInput("");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (isPaid) {
    return (
      <div className="text-center py-8 animate-fadeIn">
        <div className="receipt">
          <div className="receipt-header">
            <h2 className="font-bold text-xl">SuperMatemático</h2>
            <p>{new Date().toLocaleString("es-MX")}</p>
          </div>
          <div className="receipt-items">
            {Object.values(cart).map((item) => (
              <div key={item.id} className="receipt-item">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="receipt-total receipt-item">
            <span>TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="receipt-item mt-2 text-blue-600">
            <span>Puntuación Final</span>
            <span>{score}</span>
          </div>
        </div>
        <p className="text-xl mt-4 text-center font-bold">
          ¡Gracias por tu compra!
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-blue-100 p-8 rounded-2xl border-2 border-blue-200 animate-fadeIn ${
        isShaking ? "shake" : ""
      }`}
    >
      <h2 className="text-3xl font-bold text-blue-800">¡A Pagar!</h2>
      <p className="text-lg mt-4">
        El total de tu compra es:{" "}
        <span className="font-bold text-green-600">${total.toFixed(2)}</span>.
      </p>
      <p className="text-lg mt-2">
        Tu presupuesto total es de:{" "}
        <span className="font-bold">${paymentBill.toFixed(2)}</span>.
      </p>
      <form onSubmit={handleSubmitChange}>
        <label htmlFor="change-input" className="block mt-6 text-xl font-bold">
          ¿Cuánto cambio deben darte?
        </label>
        <input
          type="number"
          step="0.01"
          id="change-input"
          value={changeInput}
          onChange={(e) => setChangeInput(e.target.value)}
          className="w-full max-w-xs mx-auto mt-2 border-2 border-gray-300 rounded-lg p-3 text-center text-xl"
          placeholder="Escribe el cambio..."
          required
        />
        <button
          type="submit"
          className="btn w-full max-w-xs mx-auto mt-4 bg-blue-500 text-white font-bold py-3 rounded-lg"
        >
          Confirmar Pago
        </button>
      </form>
    </div>
  );
};

export default FinalScreen;
