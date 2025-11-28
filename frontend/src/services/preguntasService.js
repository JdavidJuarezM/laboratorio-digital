// frontend/src/services/preguntasService.js
import apiClient from "./apiClient";

export const getPreguntas = async () => {
  // CORRECCIÓN: Cambiado de "/api/preguntas" a "/preguntas"
  const { data } = await apiClient.get("/preguntas");

  // Si el backend devuelve un objeto vacío, retornamos null
  if (Object.keys(data).length === 0) return null;
  return data;
};

export const guardarPreguntas = async (preguntas) => {
  // CORRECCIÓN: Cambiado de "/api/preguntas/..." a "/preguntas/..."
  const { data } = await apiClient.post("/preguntas/guardar-todo", preguntas);
  return data;
};