// frontend/src/services/huertoService.js

// Importamos nuestro apiClient configurado (con baseURL y interceptor JWT)
import apiClient from "./apiClient";

/**
 * @file Define funciones para interactuar con el endpoint de la API del huerto.
 */

/**
 * Obtiene el estado actual del huerto del usuario autenticado desde el servidor.
 * @returns {Promise<object|null>} El estado del huerto ({ etapa, agua, sol, respuestasCorrectas }) o null si hay un error.
 */
export const getEstadoHuerto = async () => {
  try {
    // Hacemos un GET a /api/huerto. apiClient añadirá el token JWT automáticamente.
    const { data } = await apiClient.get("/huerto");
    // El backend ahora devuelve directamente el DTO con el estado
    return data; // Devuelve { etapa, agua, sol, respuestasCorrectas }
  } catch (error) {
    console.error("Error al cargar el estado del huerto:", error.response?.data || error.message);
    // Devolvemos null o propagamos el error según cómo lo maneje el hook useHuertoState
    // Devolver null puede ser más simple para el hook
    return null;
  }
};

/**
 * Guarda el nuevo estado del huerto en el servidor para el usuario autenticado.
 * @param {object} nuevoEstado - El nuevo estado a guardar ({ etapa, agua, sol, respuestasCorrectas }).
 * @returns {Promise<object>} La respuesta del servidor (generalmente un mensaje de éxito).
 */
export const guardarEstadoHuerto = async (nuevoEstado) => {
  try {
    // Hacemos un POST a /api/huerto/actualizar con el nuevo estado en el cuerpo.
    // apiClient añadirá el token JWT automáticamente.
    const { data } = await apiClient.post("/huerto/actualizar", nuevoEstado);
    return data; // Devuelve { message: "Progreso guardado exitosamente" }
  } catch (error) {
    console.error("Error al guardar el estado del huerto:", error.response?.data || error.message);
    // Propagamos el error para que el hook useHuertoState pueda saber si falló el guardado
    throw error;
  }
};
