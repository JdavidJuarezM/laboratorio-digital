import apiClient from "./apiClient";

export const login = async (email, password) => {
    try {
        const {data} = await apiClient.post("/maestros/login", {
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

export const register = async (nombre, email, password) => {
    try {
        const {data} = await apiClient.post("/maestros/registro", {
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

export const getProfile = async () => {
    try {
        const {data} = await apiClient.get("/maestros/perfil");
        return data;
    } catch (error) {
        console.error(
            "Error en el servicio de obtener perfil:",
            error.response?.data || error.message
        );
        throw error.response?.data || new Error("Error de red o en el servidor");
    }
}
