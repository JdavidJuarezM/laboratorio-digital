// client/src/App.jsx

import "./styles/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

// --- INICIO DE CORRECCIÓN ---
// Rutas ajustadas para que coincidan con tu estructura de carpetas.
import LoginForm from "./components/modules/LoginForm";
import RegistroForm from "./components/modules/RegistroForm";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Esta ruta ya era correcta
import HuertoVirtual from "./components/HuertoVirtual/HuertoVirtual";
// --- FIN DE CORRECCIÓN ---

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
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
          {/* Esta ruta se renderizará donde pongamos el <Outlet /> en DashboardPage */}
          <Route path="huerto" element={<HuertoVirtual />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
