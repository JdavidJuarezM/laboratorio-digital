import apiClient from "./apiClient";

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
    throw error.response?.data || new Error("Error de red o en el servidor");
  }
};

// --- 👇 FUNCIÓN AÑADIDA 👇 ---
export const register = async (nombre, email, password) => {
  try {
    // La ruta para registrar es POST a /api/maestros, según tu backend
    const { data } = await apiClient.post("/maestros", {
      nombre,
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error(
      "Error en el servicio de registro:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error de red o en el servidor");
  }
};
