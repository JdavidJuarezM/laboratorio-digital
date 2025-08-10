// en client/src/services/apiClient.js

import axios from "axios";

// Aquí podrías tener la URL base importada desde un archivo de configuración
const API_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token de autorización a cada petición
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
