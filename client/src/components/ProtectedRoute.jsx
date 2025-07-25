// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al usuario a la página de login
    return <Navigate to="/" replace />;
  }

  // Si hay un token, muestra el contenido de la página protegida
  return children;
}

// La línea que faltaba para resolver el error:
export default ProtectedRoute;
