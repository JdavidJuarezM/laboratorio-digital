// src/services/apiClient.js

import axios from "axios";

// La URL base se obtiene de las variables de entorno de Vite
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL,
});

// --- 👇 ESTA ES LA PARTE NUEVA Y CRUCIAL 👇 ---
// Interceptor para añadir el token a cada petición autenticada
apiClient.interceptors.request.use(
  (config) => {
    // 1. Obtiene el token del localStorage
    const token = localStorage.getItem("token");

    // 2. Si el token existe, lo añade a los encabezados de la petición
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 3. Devuelve la configuración modificada para que la petición continúe
    return config;
  },
  (error) => {
    // Maneja errores en la configuración de la petición
    return Promise.reject(error);
  }
);
// --- FIN DE LA SECCIÓN NUEVA ---

export default apiClient;
