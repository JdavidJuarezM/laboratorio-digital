import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderIcon, FileIcon, ResourcesIcon } from "../Icons";
import apiClient from "../../services/apiClient";

// Icono simple para enlaces (puedes moverlo a Icons.jsx si prefieres)
const LinkIcon = () => <span className="text-2xl">🔗</span>;

const CATEGORIAS = [
  { id: "videos", name: "Videos", color: "bg-red-100 text-red-600" },
  { id: "fotos", name: "Fotos", color: "bg-blue-100 text-blue-600" },
  { id: "pdf", name: "Documentos PDF", color: "bg-orange-100 text-orange-600" },
  { id: "diapositivas", name: "Diapositivas", color: "bg-yellow-100 text-yellow-600" },
  { id: "enlaces", name: "Enlaces Web", color: "bg-teal-100 text-teal-600" }, // Nueva categoría opcional
];

const RecursosDigitales = () => {
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Estados para el formulario
  const [tipoSubida, setTipoSubida] = useState("archivo"); // 'archivo' o 'link'
  const [nuevoRecurso, setNuevoRecurso] = useState({ titulo: "", file: null, url: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (categoriaActual) {
      cargarRecursos(categoriaActual.id);
    }
  }, [categoriaActual]);

  const cargarRecursos = async (categoria) => {
    try {
      const { data } = await apiClient.get(`/recursos/${categoria}`);
      setRecursos(data);
    } catch (error) {
      console.error("Error cargando recursos", error);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "MAESTRO2025") {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassword("");
    } else {
      alert("Clave incorrecta");
    }
  };

  const handleSubmitRecurso = async (e) => {
    e.preventDefault();
    if (!nuevoRecurso.titulo) return;

    setUploading(true);
    try {
      if (tipoSubida === "archivo") {
        // Lógica de Archivo
        if (!nuevoRecurso.file) return;
        const formData = new FormData();
        formData.append("file", nuevoRecurso.file);
        formData.append("titulo", nuevoRecurso.titulo);
        formData.append("categoria", categoriaActual.id);

        await apiClient.post("/recursos/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Lógica de Enlace (Nuevo)
        if (!nuevoRecurso.url) return;
        await apiClient.post("/recursos/link", {
          titulo: nuevoRecurso.titulo,
          url: nuevoRecurso.url,
          categoria: categoriaActual.id,
        });
      }

      setShowUploadModal(false);
      setNuevoRecurso({ titulo: "", file: null, url: "" });
      cargarRecursos(categoriaActual.id);
    } catch (err) {
      console.error("Error al guardar", err);
      alert("Error al guardar el recurso");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este recurso?")) {
      try {
        await apiClient.delete(`/recursos/${id}`);
        cargarRecursos(categoriaActual.id);
      } catch (error) {
        console.error("Error eliminando", error);
      }
    }
  };

  return (
    <div className="p-6 w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ResourcesIcon className="text-purple-500" />
          {categoriaActual ? categoriaActual.name : "Biblioteca de Recursos"}
        </h1>
        <div>
          {!isAdmin ? (
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-sm text-gray-500 hover:text-purple-600 underline font-semibold"
            >
              Soy Maestro
            </button>
          ) : (
            <button
              onClick={() => setIsAdmin(false)}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold border border-purple-300 hover:bg-purple-200 transition flex items-center gap-2"
            >
              Modo Maestro Activo 👨‍🏫 <span className="text-xs text-purple-600">(Salir)</span>
            </button>
          )}
        </div>
      </div>

      {/* Categorías */}
      {!categoriaActual && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIAS.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCategoriaActual(cat)}
              className={`cursor-pointer p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4 border-4 border-white ${cat.color} transition-all hover:shadow-xl`}
            >
              <div className="text-6xl">
                {cat.id === "enlaces" ? "🔗" : <FolderIcon />}
              </div>
              <h3 className="text-xl font-bold">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lista de Recursos */}
      {categoriaActual && (
        <div className="animate-fadeIn">
          <button
            onClick={() => setCategoriaActual(null)}
            className="mb-6 text-gray-600 hover:text-purple-600 font-bold flex items-center gap-2"
          >
            ⬅ Volver a carpetas
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mb-6 bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 transition flex items-center gap-2"
            >
              ➕ Agregar Recurso
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recursos.length === 0 ? (
              <p className="text-gray-500 col-span-3 text-center text-xl mt-10">
                Esta carpeta está vacía por ahora.
              </p>
            ) : (
              recursos.map((recurso) => (
                <div
                  key={recurso.id}
                  className="bg-white p-4 rounded-xl shadow border-2 border-gray-100 flex items-center justify-between hover:border-purple-200 transition group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="text-3xl text-gray-400">
                      {/* Si el tipo es 'link' o la URL empieza con http (externo), mostramos icono de enlace */}
                      {recurso.tipoArchivo === "link" || recurso.url.startsWith("http") ? (
                        <LinkIcon />
                      ) : (
                        <FileIcon />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-800 truncate" title={recurso.titulo}>
                        {recurso.titulo}
                      </span>
                      <a
                        href={recurso.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline mt-1 flex items-center gap-1"
                      >
                        {recurso.tipoArchivo === "link" ? "Abrir enlace ↗" : "Ver / Descargar"}
                      </a>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(recurso.id)}
                      className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de Acceso Maestro (Sin cambios) */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Acceso Maestros</h2>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="password"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-purple-500 outline-none"
                  placeholder="Ingresa la clave..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="flex-1 py-2 bg-gray-200 rounded-lg font-bold text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Agregar Recurso (ACTUALIZADO) */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Agregar Nuevo Recurso
              </h2>

              {/* Selector de Tipo */}
              <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTipoSubida("archivo")}
                  className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                    tipoSubida === "archivo"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  📄 Subir Archivo
                </button>
                <button
                  type="button"
                  onClick={() => setTipoSubida("link")}
                  className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                    tipoSubida === "link"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🔗 Pegar Enlace
                </button>
              </div>

              <form onSubmit={handleSubmitRecurso} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Título del recurso
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Video sobre plantas"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    value={nuevoRecurso.titulo}
                    onChange={(e) =>
                      setNuevoRecurso({ ...nuevoRecurso, titulo: e.target.value })
                    }
                  />
                </div>

                {tipoSubida === "archivo" ? (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Seleccionar Archivo
                    </label>
                    <input
                      type="file"
                      required={tipoSubida === "archivo"}
                      className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      onChange={(e) =>
                        setNuevoRecurso({ ...nuevoRecurso, file: e.target.files[0] })
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      URL del Enlace
                    </label>
                    <input
                      type="url"
                      required={tipoSubida === "link"}
                      placeholder="https://youtube.com/..."
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                      value={nuevoRecurso.url}
                      onChange={(e) =>
                        setNuevoRecurso({ ...nuevoRecurso, url: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="flex gap-2 mt-8 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-md"
                  >
                    {uploading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecursosDigitales;