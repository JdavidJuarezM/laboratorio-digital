// frontend/src/components/HuertoVirtual/components/WeatherFX.jsx
import React, { useMemo } from "react";
import "./WeatherFX.css"; // Crearemos este CSS en el siguiente paso

const WeatherFX = ({ clima }) => {
  // Generamos gotas de lluvia aleatorias solo una vez
  const drops = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1}s`,
      animationDuration: `${0.5 + Math.random() * 0.5}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Capa de Lluvia */}
      {clima === "rainy" && (
        <div className="rain-container">
          {drops.map((drop, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: drop.left,
                animationDelay: drop.animationDelay,
                animationDuration: drop.animationDuration,
              }}
            />
          ))}
        </div>
      )}

      {/* Capa de Filtros de Luz (Overlay) */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          clima === "rainy"
            ? "bg-slate-900/40 mix-blend-multiply" // Oscuro y azulado
            : clima === "heatwave"
            ? "bg-orange-500/20 mix-blend-overlay" // Brillante y anaranjado
            : "bg-transparent"
        }`}
      />

      {/* Efecto de Sol Intenso (Destello) */}
      {clima === "heatwave" && (
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-yellow-200/30 to-transparent animate-pulse" />
      )}
    </div>
  );
};

export default WeatherFX;