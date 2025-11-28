import apiClient from "./apiClient";

// --- Productos ---
export const getProductos = async () => {
  const { data } = await apiClient.get("/productos");
  return data;
};

export const crearProducto = async (producto) => {
  const { data } = await apiClient.post("/productos", producto);
  return data;
};

export const eliminarProducto = async (id) => {
  const { data } = await apiClient.delete(`/productos/${id}`);
  return data;
};

// --- NUEVO: Categorías ---
export const getCategoriasProductos = async () => {
  try {
    const { data } = await apiClient.get("/productos/categorias");
    return data;
  } catch (error) {
    console.error("Error cargando categorías de productos", error);
    return [];
  }
};

export const crearCategoriaProducto = async (nombre) => {
  const { data } = await apiClient.post("/productos/categorias", { nombre });
  return data;
};

export const eliminarCategoriaProducto = async (id) => {
  await apiClient.delete(`/productos/categorias/${id}`);
};