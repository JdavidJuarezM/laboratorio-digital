import axios from "axios";
import { GAME_CONFIG } from "../constants/gameConfig";

const API_URL = `${GAME_CONFIG.API_BASE_URL}/huerto`;

export const fetchHuertoState = async (token) => {
  if (!token) return null;
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error) {
    console.error("Error al cargar estado:", error);
    return null;
  }
};

export const saveHuertoState = async (stateToSave, token) => {
  if (!token) return;
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(`${API_URL}/actualizar`, stateToSave, config);
  } catch (error) {
    console.error("Error al guardar estado:", error);
  }
};
