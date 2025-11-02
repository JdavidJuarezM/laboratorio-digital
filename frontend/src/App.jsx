// src/App.jsx

import "./styles/tailwind.css";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import soundService from "./services/soundService";

import LoginForm from "./components/modules/LoginForm";
import RegistroForm from "./components/modules/RegistroForm";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HuertoVirtual from "./components/HuertoVirtual/HuertoVirtual";
import Vocabulario from "./components/Vocabulario/Vocabulario";
import Supermercado from "./components/Supermercado/Supermercado"; // <-- IMPORTA EL NUEVO JUEGO
import DashboardWelcome from "./components/DashboardWelcome";
import GameFrame from "./components/GameFrame";
import Reciclaje from "./components/Reciclaje/Reciclaje"; // <-- 1. IMPORTAR EL NUEVO COMPONENTE

function App() {
  useEffect(() => {
    const initializeAudio = () => {
      console.log("User interaction detected, starting audio context...");
      soundService.start();
    };

    window.addEventListener("click", initializeAudio, { once: true });

    return () => {
      window.removeEventListener("click", initializeAudio);
    };
  }, []);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/registro" element={<RegistroForm />} />

      {/* Ruta anidada y protegida para el Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        {/* La página principal del dashboard */}
        <Route index element={<DashboardWelcome />} />

        {/* Rutas para cada juego anidadas dentro de /dashboard */}
        <Route
          path="huerto"
          element={
            <GameFrame title="Mi Huerto Virtual">
              <HuertoVirtual />
            </GameFrame>
          }
        />
        <Route
          path="vocabulario"
          element={
            <GameFrame title="Juego de Vocabulario">
              <Vocabulario />
            </GameFrame>
          }
        />
        <Route
          path="supermercado"
          element={
            <GameFrame title="Supermercado Matemático">
              <Supermercado />
            </GameFrame>
          }
        />

        {/* <-- 2. AÑADIR LA NUEVA RUTA DEL JUEGO --> */}
        <Route
          path="reciclaje"
          element={
            <GameFrame title="Misión Reciclaje">
              <Reciclaje />
            </GameFrame>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;

