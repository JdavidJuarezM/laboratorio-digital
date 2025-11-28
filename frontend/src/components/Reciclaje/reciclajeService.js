// frontend/src/components/Reciclaje/reciclajeService.js

import apiClient from "../../services/apiClient.js";

// --- High Scores (Existente) ---
export const getHighScore = async () => {
  try {
    const { data } = await apiClient.get("/reciclaje/highscore");
    return data;
  } catch (error) {
    console.error("Error al cargar high score:", error);
    throw error;
  }
};

export const saveHighScore = async (score) => {
  try {
    const { data } = await apiClient.post("/reciclaje/guardar", { score });
    return data;
  } catch (error) {
    console.error("Error al guardar high score:", error);
    throw error;
  }
};

// --- NUEVO: Gestión de Items ---
export const getItemsReciclaje = async () => {
  try {
    const { data } = await apiClient.get("/reciclaje/items");
    return data;
  } catch (error) {
    console.error("Error cargando items:", error);
    return [];
  }
};

export const crearItemReciclaje = async (item) => {
  const { data } = await apiClient.post("/reciclaje/items", item);
  return data;
};

export const eliminarItemReciclaje = async (id) => {
  await apiClient.delete(`/reciclaje/items/${id}`);
};