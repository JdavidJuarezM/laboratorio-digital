// frontend/src/components/Supermercado/services/supermercadoService.js

import apiClient from "../../../services/apiClient";

export const getHighScore = async () => {
  try {
    const { data } = await apiClient.get("/supermercado/highscore");
    return data;
  } catch (error) {
    console.warn("No se pudo cargar el highscore, usando 0:", error);
    return { highScore: 0 };
  }
};

export const saveScore = async (score) => {
  try {
    const { data } = await apiClient.post("/supermercado/guardar", { score });
    return data;
  } catch (error) {
    console.error("Error guardando el score:", error);
    throw error;
  }
};