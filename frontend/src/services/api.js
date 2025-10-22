// src/services/api.js
import axios from "axios";
import { API_URL } from "../config";

/**
 * @file Configura una instancia de Axios para todas las llamadas a la API.
 * Centraliza la URL base y la inyección del token de autenticación.
 */
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token de autorización a cada petición.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
