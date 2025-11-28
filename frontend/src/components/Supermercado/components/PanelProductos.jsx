import React, { useState, useEffect } from "react";
import { getProductos, crearProducto, eliminarProducto } from "../../../services/productosService";
// Importamos los datos iniciales para poder cargarlos masivamente si la BD está vacía
import { PRODUCTS } from "../constants/gameData";

const CATEGORIAS = ["Frutas y Verduras", "Lácteos y Huevo", "Panadería y Dulces", "Bebidas", "Carnes y Comida", "Despensa y Limpieza", "Otros"];

const PanelProductos = ({ onClose }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    emoji: "",
    precio: "",
    categoria: "Otros"
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    const data = await getProductos();
    setProductos(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    await crearProducto(nuevoProducto);
    setNuevoProducto({ nombre: "", emoji: "", precio: "", categoria: "Otros" });
    cargarProductos();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await eliminarProducto(id);
      cargarProductos();
    }
  };

  // Función para cargar todos los productos de gameData.js a la Base de Datos
  const cargarDatosIniciales = async () => {
    if(!window.confirm("¿Estás seguro? Esto agregará todos los productos predeterminados a la base de datos.")) return;

    setLoading(true);
    try {
      // Mapear los datos de gameData al formato que espera el backend (nombre, precio, etc)
      const promesas = PRODUCTS.map(p => {
        return crearProducto({
          nombre: p.name,
          emoji: p.emoji,
          precio: p.price,
          categoria: p.categoria
        });
      });

      await Promise.all(promesas);
      alert("¡Productos cargados exitosamente!");
      cargarProductos();
    } catch (error) {
      console.error("Error cargando datos iniciales", error);
      alert("Hubo un error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Gestión de Productos</h2>
          <button onClick={onClose} className="text-white hover:bg-purple-700 px-3 py-1 rounded border border-purple-400">Cerrar</button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">

          {/* Botón de Carga Inicial (Solo aparece si hay pocos productos) */}
          {productos.length < 5 && (
            <div className="bg-blue-100 p-4 rounded-xl mb-6 flex justify-between items-center border border-blue-200">
              <div>
                <h3 className="font-bold text-blue-800">Base de datos vacía</h3>
                <p className="text-sm text-blue-600">Carga los productos predeterminados con un solo clic.</p>
              </div>
              <button
                onClick={cargarDatosIniciales}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow transition"
              >
                {loading ? "Cargando..." : "📥 Cargar Productos Iniciales"}
              </button>
            </div>
          )}

          {/* Formulario de Agregar */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-green-500">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Agregar Nuevo Producto</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE</label>
                <input name="nombre" value={nuevoProducto.nombre} onChange={handleInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-200 outline-none" placeholder="Ej: Manzana" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">EMOJI</label>
                <input name="emoji" value={nuevoProducto.emoji} onChange={handleInputChange} className="w-full p-2 border rounded text-center text-xl focus:ring-2 focus:ring-green-200 outline-none" placeholder="🍎" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">PRECIO</label>
                <input name="precio" type="number" step="0.5" value={nuevoProducto.precio} onChange={handleInputChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-200 outline-none" placeholder="0.00" required />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">CATEGORÍA</label>
                <select name="categoria" value={nuevoProducto.categoria} onChange={handleInputChange} className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-green-200 outline-none">
                  {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 h-10 shadow transition">
                Guardar
              </button>
            </form>
          </div>

          {/* Lista de Productos */}
          {loading && <p className="text-center text-gray-500">Cargando lista...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((prod) => (
              <div key={prod.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-3xl bg-gray-100 p-2 rounded-md">{prod.emoji || "📦"}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate">{prod.nombre}</p>
                    <p className="text-xs text-gray-500">{prod.categoria} • <span className="text-green-600 font-bold">${prod.precio}</span></p>
                  </div>
                </div>
                <button onClick={() => handleEliminar(prod.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition ml-2">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelProductos;