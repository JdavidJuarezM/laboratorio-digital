import apiClient from "../../../services/apiClient";

export const getHighScore = async () => {
  try {
    const { data } = await apiClient.get("/vocabulario/highscore");
    return data;
  } catch (error) {
    console.warn("Error cargando highscore vocabulario, usando local:", error);
    return { highScore: 0, streak: 0 };
  }
};

export const saveScore = async (score, streak) => {
  try {
    const { data } = await apiClient.post("/vocabulario/guardar", { score, streak });
    return data;
  } catch (error) {
    console.error("Error guardando score vocabulario:", error);
    throw error;
  }
};