// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// 1. Creamos el Contexto
const AuthContext = createContext();

// 2. Creamos un hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Creamos el Proveedor del Contexto (el "cerebro" de la autenticación)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(null); // Aquí guardaremos los datos del usuario en el futuro
  const navigate = useNavigate();

  const loginAccion = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // En el futuro, aquí recibirías y guardarías los datos del usuario
    // setUsuario(datosUsuario);
    navigate("/dashboard/huerto"); // Redirige al dashboard después del login
  };

  const logoutAccion = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
    navigate("/"); // Redirige al login después de cerrar sesión
  };

  const value = {
    token,
    usuario,
    isAuthenticated: !!token, // Es true si hay un token, false si no
    login: loginAccion,
    logout: logoutAccion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
