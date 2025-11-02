// frontend/src/components/Reciclaje/reciclajeService.js

import apiClient from "../../services//api.js";

/**
 * Obtiene el high score de reciclaje del usuario autenticado.
 * @returns {Promise<object>} Un objeto, ej: { highScore: 1500 }
 */
export const getHighScore = async () => {
  try {
    // Hacemos un GET a /api/reciclaje/highscore. apiClient añadirá el token.
    const { data } = await apiClient.get("/reciclaje/highscore");
    return data;
  } catch (error) {
    console.error("Error al cargar el high score de reciclaje:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error de red o en el servidor");
  }
};

/**
 * Guarda un nuevo high score de reciclaje para el usuario autenticado.
 * @param {number} score - El nuevo high score a guardar.
 * @returns {Promise<object>} La respuesta del servidor.
 */
export const saveHighScore = async (score) => {
  try {
    // Hacemos un POST a /api/reciclaje/guardar con el score.
    const { data } = await apiClient.post("/reciclaje/guardar", { score });
    return data;
  } catch (error) {
    console.error("Error al guardar el high score de reciclaje:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error de red o en el servidor");
  }
};
