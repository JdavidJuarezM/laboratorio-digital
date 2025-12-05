// frontend/src/context/AuthContext.jsx


import React, {createContext, useState, useContext, useEffect} from "react";
import {
    login as loginService,
    register as registerService,
    getProfile as getProfileService
} from "../services/authService";
import apiClient from "../services/apiClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validarToken = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userData = await getProfileService();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Token inválido o error al obtener perfil:", error);
                    localStorage.removeItem("token");
                    delete apiClient.defaults.headers.common["Authorization"];
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        validarToken();
    }, []);


    const login = async (email, password) => {
        const {token} = await loginService(email, password);
        localStorage.setItem("token", token);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
            const userData = await getProfileService();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error al obtener perfil después del login:", error);
            logout();
            throw error;
        }
    };

    const register = async (nombre, email, password) => {
        await registerService(nombre, email, password);
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
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
