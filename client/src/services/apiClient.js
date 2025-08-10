// en client/src/services/apiClient.js

import axios from "axios";

// 1. Lee la variable de entorno de Vite.
// Vite automáticamente reemplazará esto con el valor correcto durante la compilación.
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  // 2. Usa la variable para la URL base.
  baseURL: API_URL,
});

// 3. El interceptor que ya tienes está perfecto. Se encarga de añadir el token.
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
