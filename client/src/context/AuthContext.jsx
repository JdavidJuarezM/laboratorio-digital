import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
} from "../services/authService";
import apiClient from "../services/apiClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const { data } = await apiClient.get("/maestros/perfil");
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    validarToken();
  }, []);

  const login = async (email, password) => {
    const { token, maestro } = await loginService(email, password);
    localStorage.setItem("token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(maestro);
    setIsAuthenticated(true);
  };

  // --- 👇 NUEVA FUNCIÓN AÑADIDA 👇 ---
  const register = async (nombre, email, password) => {
    // 1. Llama al servicio para crear el nuevo usuario
    await registerService(nombre, email, password);
    // 2. Si el registro es exitoso, llama a la función de login para autenticarlo
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register, // <-- Exportamos la nueva función
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
