// src/services/huertoService.js
import apiClient from "./api";

/**
 * @file Define funciones para interactuar con el endpoint de la API del huerto.
 */

/**
 * Obtiene el estado actual del huerto desde el servidor.
 * @returns {Promise<object>} El estado del huerto.
 */
export const fetchHuertoState = async () => {
  try {
    const { data } = await apiClient.get("/huerto");
    return data;
  } catch (error) {
    console.error("Error al cargar el estado del huerto:", error);
    // En una app real, aquí se podría manejar el error de forma más robusta.
    throw error;
  }
};

/**
 * Guarda el nuevo estado del huerto en el servidor.
 * @param {object} newState - El nuevo estado a guardar ({ etapa, agua, sol }).
 * @returns {Promise<void>}
 */
export const saveHuertoState = async (newState) => {
  try {
    await apiClient.post("/huerto/actualizar", newState);
  } catch (error) {
    console.error("Error al guardar el estado del huerto:", error);
    throw error;
  }
};
