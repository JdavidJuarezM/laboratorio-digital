import React, { useState, useEffect } from "react";
import { getItemsReciclaje, crearItemReciclaje, eliminarItemReciclaje } from "./reciclajeService.js";
import { binData } from "./constants"; // Para obtener los tipos de contenedores (colores y nombres)

const PanelReciclaje = ({ onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    nombre: "",
    icono: "", // Emoji
    tipo: "plastic" // Default
  });

  useEffect(() => {
    cargarItems();
  }, []);

  const cargarItems = async () => {
    setLoading(true);
    const data = await getItemsReciclaje();
    setItems(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setNuevoItem({ ...nuevoItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoItem.nombre || !nuevoItem.icono) return;

    await crearItemReciclaje(nuevoItem);
    setNuevoItem({ nombre: "", icono: "", tipo: "plastic" });
    cargarItems();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este objeto?")) {
      await eliminarItemReciclaje(id);
      cargarItems();
    }
  };

  // Helper para obtener color del tipo
  const getBinColor = (tipo) => {
    const bin = binData.find(b => b.id === tipo);
    return bin ? bin.color : "bg-gray-400";
  };

  const getBinLabel = (tipo) => {
    const bin = binData.find(b => b.id === tipo);
    return bin ? bin.label : "Desconocido";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-green-500">

        {/* Header */}
        <div className="bg-green-600 p-4 flex justify-between items-center text-white shadow-md">
          <h2 className="text-2xl font-bold flex items-center gap-2">♻️ Gestión de Residuos</h2>
          <button onClick={onClose} className="text-white hover:bg-green-700 px-4 py-1 rounded-full font-bold transition border-2 border-white/30">
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-green-50 custom-scrollbar">

          {/* Formulario */}
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border-2 border-green-100">
            <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center gap-2">
              <span>➕</span> Agregar Nuevo Residuo
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre</label>
                <input
                  name="nombre"
                  value={nuevoItem.nombre}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition"
                  placeholder="Ej: Cartón de Leche"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Emoji (Icono)</label>
                <input
                  name="icono"
                  value={nuevoItem.icono}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-center text-2xl focus:border-green-500 outline-none transition"
                  placeholder="🥛"
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tipo de Contenedor</label>
                <select
                  name="tipo"
                  value={nuevoItem.tipo}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-green-500 outline-none cursor-pointer"
                >
                  {binData.map(bin => (
                    <option key={bin.id} value={bin.id}>
                      {bin.icon} {bin.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg transform active:scale-95 transition">
                  Guardar
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Items */}
          <h3 className="font-bold text-gray-700 mb-4 px-2">Items Personalizados ({items.length})</h3>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Cargando...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.length === 0 ? (
                <p className="col-span-full text-center text-gray-400 py-8 italic border-2 border-dashed border-gray-200 rounded-xl">
                  No hay items personalizados. ¡Agrega uno arriba!
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl bg-gray-50 p-2 rounded-lg">{item.icono}</span>
                      <div>
                        <p className="font-bold text-gray-800">{item.nombre}</p>
                        <span className={`text-xs text-white px-2 py-1 rounded-full font-bold ${getBinColor(item.tipo)}`}>
                          {getBinLabel(item.tipo)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEliminar(item.id)}
                      className="bg-red-50 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelReciclaje;