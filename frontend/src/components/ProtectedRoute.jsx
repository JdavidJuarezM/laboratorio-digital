// client/src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  // Ahora extraemos también 'isLoading' del contexto
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Si está cargando (verificando el token en localStorage), mostramos un spinner
  // y NO redirigimos todavía.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-semibold">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // 2. Si terminó de cargar y NO está autenticado, entonces sí redirigimos al Login.
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado, mostramos el contenido protegido.
  return children;
}

export default ProtectedRoute;