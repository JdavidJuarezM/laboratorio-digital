// frontend/src/services/alumnosService.js
import apiClient from "./apiClient";

export const getAlumnos = async () => {
    // CORRECTO: Solo "/alumnos", NO "/api/alumnos"
    const {data} = await apiClient.get("/alumnos");
    return data;
};

export const crearAlumno = async (nombre) => {
    const {data} = await apiClient.post("/alumnos", {nombre});
    return data;
};

export const eliminarAlumno = async (id) => {
    await apiClient.delete(`/alumnos/${id}`);
};

export const actualizarProgresoAlumno = async (id, etapa, aciertos) => {
    await apiClient.put(`/alumnos/${id}/progreso`, {etapa, aciertos});
};