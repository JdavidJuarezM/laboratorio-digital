// client/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Usamos nuestro hook

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // Obtenemos el estado de autenticación del contexto

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, muestra la página
  return children;
}

export default ProtectedRoute;
