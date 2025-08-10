// en client/src/services/authService.js

// Importamos nuestro cliente Axios centralizado
import apiClient from "./apiClient";

/**
 * Envía las credenciales al backend para iniciar sesión.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} La respuesta del servidor, que incluye el token.
 */
export const login = async (email, password) => {
  try {
    const { data } = await apiClient.post("/maestros/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de login:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Envía los datos de un nuevo usuario al backend para registrarlo.
 * @param {object} datosUsuario - Objeto con { nombre, email, password }.
 * @returns {Promise<object>} La respuesta del servidor.
 */
export const registro = async (datosUsuario) => {
  try {
    const { data } = await apiClient.post("/maestros/registro", datosUsuario);
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};
