import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

const AnimatedBackground = () => {
  const bubbles = Array.from({ length: 20 }).map((_, i) => (
    <div
      key={i}
      className="bubble"
      style={{
        width: `${Math.random() * 60 + 20}px`,
        height: `${Math.random() * 60 + 20}px`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 8}s`,
        animationDelay: `${Math.random() * 5}s`,
      }}
    />
  ));
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {bubbles}
    </div>
  );
};

function DashboardPage() {
  const location = useLocation();
  // Comprueba si la ruta actual es una ruta de juego (ej. /dashboard/huerto)
  const isGameView = location.pathname !== "/dashboard";

  return (
    <div
      // --- CAMBIO AQUÍ: Se quita el padding si es una vista de juego ---
      className={`min-h-screen relative ${
        isGameView ? "" : "flex items-center justify-center p-4"
      }`}
      style={{
        background:
          "linear-gradient(135deg, #a855f7, #6366f1, #3b82f6, #60a5fa)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
      }}
    >
      <AnimatedBackground />
      {/* --- CAMBIO AQUÍ: Se quitan las restricciones de tamaño si es una vista de juego --- */}
      <div
        className={`relative z-10 w-full ${
          isGameView ? "h-screen" : "max-w-5xl"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardPage;
