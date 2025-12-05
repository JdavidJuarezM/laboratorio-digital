// frontend/src/components/Vocabulario/services/vocabularioService.js
import apiClient from "../../../services/apiClient";

export const getHighScore = async () => {
    try {
        const {data} = await apiClient.get("/vocabulario/highscore");
        return data;
    } catch (error) {
        console.warn("Error cargando highscore, usando local:", error);
        return {highScore: 0, streak: 0};
    }
};

export const saveScore = async (score, streak) => {
    try {
        const {data} = await apiClient.post("/vocabulario/guardar", {score, streak});
        return data;
    } catch (error) {
        console.error("Error guardando score:", error);
        throw error;
    }
};

// --- NUEVAS FUNCIONES PARA EL PANEL ---

export const getPalabras = async () => {
    try {
        const {data} = await apiClient.get("/vocabulario/palabras");
        return data;
    } catch (error) {
        console.error("Error cargando palabras dinámicas", error);
        return [];
    }
};

export const guardarPalabra = async (palabraData) => {
    try {
        const {data} = await apiClient.post("/vocabulario/palabras", palabraData);
        return data;
    } catch (error) {
        console.error("Error guardando palabra", error);
        throw error;
    }
};

export const eliminarPalabra = async (id) => {
    try {
        await apiClient.delete(`/vocabulario/palabras/${id}`);
    } catch (error) {
        console.error("Error eliminando palabra", error);
        throw error;
    }
};
// --- NUEVAS FUNCIONES DE CATEGORÍAS ---

export const getCategorias = async () => {
    try {
        const {data} = await apiClient.get("/vocabulario/categorias");
        return data; // Devuelve array de objetos [{id, nombre}, ...]
    } catch (error) {
        console.error("Error cargando categorías", error);
        return [];
    }
};

export const guardarCategoria = async (nombre) => {
    try {
        const {data} = await apiClient.post("/vocabulario/categorias", {nombre});
        return data;
    } catch (error) {
        console.error("Error guardando categoría", error);
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        await apiClient.delete(`/vocabulario/categorias/${id}`);
    } catch (error) {
        console.error("Error eliminando categoría", error);
        throw error;
    }
};