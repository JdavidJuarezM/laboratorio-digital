// client/src/App.jsx
import "./styles/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HuertoVirtual from "./components/HuertoVirtual/HuertoVirtual";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/registro" element={<RegistroForm />} />
        {/* --- INICIO DE LA MODIFICACIÓN --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route path="huerto" element={<HuertoVirtual />} />
        </Route>
        {/* --- FIN DE LA MODIFICACIÓN --- */}
      </Routes>
    </div>
  );
}

export default App;
