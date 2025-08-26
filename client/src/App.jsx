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
import DashboardWelcome from "./components/DashboardWelcome";
import GameFrame from "./components/GameFrame"; // <-- 1. Importa el nuevo GameFrame

function App() {
  useEffect(() => {
    const initializeAudio = () => {
      console.log("User interaction detected, starting audio context...");
      soundService.start();
    };

    // Añadimos un listener para el primer clic que se ejecuta una sola vez.
    window.addEventListener("click", initializeAudio, { once: true });

    // Limpiamos el listener si el componente se desmonta.
    return () => {
      window.removeEventListener("click", initializeAudio);
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.
  // --- FIN DEL BLOQUE AÑADIDO --
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
        {/* Ruta por defecto para /dashboard */}
        <Route index element={<DashboardWelcome />} />

        {/* --- 2. CORRECCIÓN AQUÍ --- */}
        {/* La ruta del juego ahora se envuelve en el GameFrame */}
        <Route
          path="huerto"
          element={
            <GameFrame title="Mi Huerto Virtual">
              <HuertoVirtual />
            </GameFrame>
          }
        />

        {/* Aquí puedes añadir futuros juegos, siguiendo el mismo patrón */}
        {/* <Route path="supermercado" element={<GameFrame title="Supermercado"><Supermercado /></GameFrame>} /> */}
      </Route>
    </Routes>
  );
}

export default App;
