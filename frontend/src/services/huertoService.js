// client/src/services/huertoService.js

// La importación de tu apiClient es correcta.
// Asegúrate de que el archivo se llame 'apiClient.js' o 'api.js' según tu estructura final.
import apiClient from "./apiClient";

/**
 * @file Define funciones para interactuar con el endpoint de la API del huerto.
 */

/**
 * Obtiene el estado actual del huerto desde el servidor.
 * @returns {Promise<object|null>} El estado del huerto o null si hay un error.
 */
// 👇 CORRECCIÓN: Renombramos la función para que coincida con la importación.
export const getEstadoHuerto = async () => {
  try {
    const { data } = await apiClient.get("/huerto");
    // El backend devuelve el objeto completo, pero el frontend solo necesita el progreso_json
    return data;
  } catch (error) {
    console.error("Error al cargar el estado del huerto:", error);
    // Es mejor devolver null para que el hook sepa que no se pudo cargar el estado.
    return null;
  }
};

/**
 * Guarda el nuevo estado del huerto en el servidor.
 * @param {object} nuevoEstado - El nuevo estado a guardar ({ etapa, agua, sol, respuestasCorrectas }).
 * @returns {Promise<object>} La respuesta del servidor.
 */
// 👇 CORRECCIÓN: Renombramos la función para que coincida con la importación.
export const guardarEstadoHuerto = async (nuevoEstado) => {
  try {
    const { data } = await apiClient.post("/huerto/actualizar", nuevoEstado);
    return data;
  } catch (error) {
    console.error("Error al guardar el estado del huerto:", error);
    // Propagamos el error para que el componente que llama pueda manejarlo si es necesario.
    throw error;
  }
};
