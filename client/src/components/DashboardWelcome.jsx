// src/components/DashboardWelcome.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import GameCard from "./DashboardWelcome/GameCard";
import {
  HuertoIcon,
  SupermercadoIcon,
  EcosistemasIcon,
  RocketIcon,
  LogoutIcon,
} from "./Icons"; // Asumimos un archivo de iconos

const DashboardWelcome = () => {
  const { logout } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto z-10">
      <header className="text-center mb-12">
        <div className="mascot-float w-28 h-28 mx-auto mb-4">
          <RocketIcon />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Elige tu Aventura
        </h1>
        <p className="text-indigo-200 text-xl mt-2">
          ¡Haz clic en un juego para empezar a aprender!
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <GameCard
          icon={<HuertoIcon className="w-16 h-16" />}
          title="Mi Huerto Virtual"
          description="Planta, cuida y aprende sobre el crecimiento de las verduras."
          buttonColor="bg-green-500 hover:bg-green-600"
          linkTo="/dashboard/huerto"
        />
        <GameCard
          icon={<SupermercadoIcon className="w-16 h-16" />}
          title="Supermercado"
          description="Resuelve problemas de sumas y restas mientras haces la compra."
          buttonColor="bg-yellow-500 hover:bg-yellow-600"
          linkTo="/dashboard/supermercado" // Ruta futura
        />
        <GameCard
          icon={<EcosistemasIcon className="w-16 h-16" />}
          title="Ecosistemas"
          description="Coloca cada animal y planta en su hábitat correcto y observa."
          buttonColor="bg-blue-500 hover:bg-blue-600"
          linkTo="/dashboard/ecosistemas" // Ruta futura
        />
      </main>

      <footer className="text-center mt-12">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        >
          <LogoutIcon className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </footer>
    </div>
  );
};

export default DashboardWelcome;
