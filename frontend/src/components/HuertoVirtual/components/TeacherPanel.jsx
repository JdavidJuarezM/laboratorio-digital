// frontend/src/components/HuertoVirtual/components/TeacherPanel.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { bancoDePreguntas as preguntasDefault } from "../../../constants/bancoDePreguntas";
import { getAlumnos, crearAlumno, eliminarAlumno } from "../../../services/alumnosService";
import { getPreguntas, guardarPreguntas } from "../../../services/preguntasService";

// Configuración con variable de entorno
const DEFAULT_CONFIG = {
  codigoMaestro: import.meta.env.VITE_TEACHER_CODE,
};

const TeacherPanel = ({ onClose, isOpen }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'preguntas'

  // Estado de datos
  const [preguntas, setPreguntas] = useState(preguntasDefault);
  const [alumnos, setAlumnos] = useState([]);
  const [nuevoAlumno, setNuevoAlumno] = useState("");
  const [loading, setLoading] = useState(false);

  // --- CARGA INICIAL (Al autenticarse) ---
  useEffect(() => {
    if (isAuthenticated) {
      cargarDatosIniciales();
    }
  }, [isAuthenticated]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
        // 1. Cargar Alumnos
        const dataAlumnos = await getAlumnos();
        setAlumnos(dataAlumnos);

        // 2. Cargar Preguntas de la BD
        const dataPreguntas = await getPreguntas();
        if (dataPreguntas) {
            setPreguntas(dataPreguntas);
        }
    } catch (error) {
        console.error("Error cargando datos:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- MANEJADORES DE SESIÓN Y ALUMNOS ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === DEFAULT_CONFIG.codigoMaestro) {
      setIsAuthenticated(true);
    } else {
      alert("Código incorrecto");
    }
  };

  const handleAgregarAlumno = async (e) => {
    e.preventDefault();
    const nombreLimpio = nuevoAlumno.trim();
    if (!nombreLimpio) return;

    try {
      await crearAlumno(nombreLimpio);
      const data = await getAlumnos(); // Recargar lista
      setAlumnos(data);
      setNuevoAlumno("");
    } catch (error) {
      alert("Error al crear alumno.");
    }
  };

  const handleEliminarAlumno = async (id) => {
    if (window.confirm("¿Estás seguro? Se borrará el alumno y su progreso de la base de datos.")) {
      try {
        await eliminarAlumno(id);
        const data = await getAlumnos(); // Recargar lista
        setAlumnos(data);
      } catch (error) {
        alert("Error al eliminar alumno.");
      }
    }
  };

  // --- MANEJADORES DE PREGUNTAS ---

  const handleGuardarPreguntas = async () => {
    try {
        await guardarPreguntas(preguntas);
        alert("¡Cambios guardados exitosamente en la Base de Datos!");
    } catch (error) {
        console.error(error);
        alert("Error al guardar las preguntas.");
    }
  };

  const handleEditPreguntaTexto = (etapa, index, value) => {
    const nuevas = { ...preguntas };
    nuevas[etapa][index].pregunta = value;
    setPreguntas(nuevas);
  };

  const handleEditOpcion = (etapa, qIndex, optIndex, value) => {
    const nuevas = { ...preguntas };
    const preguntaActual = nuevas[etapa][qIndex];

    // Si editamos la opción que era correcta, actualizamos también el campo 'correcta'
    const eraCorrecta = preguntaActual.opciones[optIndex] === preguntaActual.correcta;
    preguntaActual.opciones[optIndex] = value;

    if (eraCorrecta) {
        preguntaActual.correcta = value;
    }
    setPreguntas(nuevas);
  };

  const handleSetCorrecta = (etapa, qIndex, valorOpcion) => {
    const nuevas = { ...preguntas };
    nuevas[etapa][qIndex].correcta = valorOpcion;
    setPreguntas(nuevas);
  };

  // Activar/Desactivar pregunta
  const handleToggleHabilitada = (etapa, index, checked) => {
    const nuevas = { ...preguntas };
    nuevas[etapa][index].habilitada = checked;
    setPreguntas(nuevas);
  };

  const handleNuevaPregunta = (etapa) => {
    const nuevas = { ...preguntas };
    if (!nuevas[etapa]) nuevas[etapa] = [];

    nuevas[etapa].push({
        pregunta: "¿Nueva pregunta?",
        opciones: ["Opción A", "Opción B", "Opción C"],
        correcta: "Opción A",
        habilitada: true
    });
    setPreguntas(nuevas);
  };

  const handleEliminarPregunta = (etapa, index) => {
    if(window.confirm("¿Borrar esta pregunta permanentemente?")) {
        const nuevas = { ...preguntas };
        nuevas[etapa].splice(index, 1);
        setPreguntas(nuevas);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >

        {/* HEADER */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            👨‍🏫 Panel de Control
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-3xl font-bold px-2 leading-none"
          >
            &times;
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">

          {/* PANTALLA DE LOGIN */}
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
               <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full text-center">
                   <div className="text-5xl mb-4">🔒</div>
                   <h3 className="text-2xl font-bold mb-2 text-slate-800">Acceso Maestro</h3>
                   <p className="text-gray-500 mb-6">Ingresa tu clave para gestionar la clase.</p>
                   <form onSubmit={handleLogin} className="flex gap-2">
                      <input
                        type="password"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        className="border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg w-full outline-none transition-colors"
                        placeholder="Código..."
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                      >
                        Entrar
                      </button>
                   </form>
               </div>
            </div>
          ) : (

            /* PANTALLA DEL PANEL (YA AUTENTICADO) */
            <div className="flex h-full">

               {/* SIDEBAR DE NAVEGACIÓN */}
               <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
                  <div className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full text-left p-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span>📊</span> Alumnos
                    </button>
                    <button
                        onClick={() => setActiveTab('preguntas')}
                        className={`w-full text-left p-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${activeTab === 'preguntas' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span>📝</span> Preguntas
                    </button>
                  </div>
               </div>

               {/* ÁREA DE TRABAJO */}
               <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">

                  {/* --- PESTAÑA: ALUMNOS --- */}
                  {activeTab === 'dashboard' && (
                    <div className="animate-fadeIn max-w-4xl mx-auto">
                      <h3 className="text-3xl font-bold mb-6 text-slate-800">Mis Alumnos</h3>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Agregar Nuevo</h4>
                        <form onSubmit={handleAgregarAlumno} className="flex gap-3">
                            <input
                                value={nuevoAlumno}
                                onChange={e=>setNuevoAlumno(e.target.value)}
                                className="border-2 border-gray-200 p-3 rounded-xl flex-1 outline-none focus:border-green-400 transition-colors"
                                placeholder="Nombre completo del alumno..."
                            />
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2">
                                <span>+</span> Agregar
                            </button>
                        </form>
                      </div>

                      {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                            <p className="mt-2 text-gray-500">Cargando datos...</p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">Nombre</th>
                                        <th className="p-4 font-semibold text-gray-600">Progreso</th>
                                        <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {alumnos.map(a => (
                                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-700 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">👤</div>
                                            {a.nombre}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${a.etapa > 3 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                Nivel {a.etapa}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleEliminarAlumno(a.id)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar de la BD"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {alumnos.length === 0 && (
                                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                                    <span className="text-4xl mb-3 opacity-50">📭</span>
                                    <p>No tienes alumnos registrados.</p>
                                </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- PESTAÑA: PREGUNTAS --- */}
                  {activeTab === 'preguntas' && (
                    <div className="animate-fadeIn max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-50 py-4 z-10 border-b border-slate-200">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800">Editor de Cuestionario</h3>
                                <p className="text-gray-500">Personaliza las preguntas de cada etapa.</p>
                            </div>
                            <button
                                onClick={handleGuardarPreguntas}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 flex items-center gap-2"
                            >
                                <span>💾</span> Guardar Cambios
                            </button>
                        </div>

                        <div className="space-y-10 pb-12">
                            {Object.keys(preguntas).map(etapa => (
                                <div key={etapa} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                        <h4 className="font-bold text-xl text-orange-600 flex items-center gap-2">
                                            <span className="bg-orange-100 p-2 rounded-lg text-2xl">🌱</span>
                                            Etapa {etapa}
                                        </h4>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                                            {preguntas[etapa].length} preguntas
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        {preguntas[etapa].map((p, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-5 rounded-xl border relative group transition-all hover:shadow-md ${p.habilitada !== false ? 'bg-slate-50 border-slate-200' : 'bg-gray-100 border-gray-300 opacity-70'}`}
                                            >

                                                {/* Botón Eliminar */}
                                                <button
                                                    onClick={() => handleEliminarPregunta(etapa, idx)}
                                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"
                                                    title="Eliminar pregunta"
                                                >
                                                    ✖
                                                </button>

                                                {/* Checkbox Habilitar */}
                                                <div className="absolute top-4 right-12 flex items-center gap-2 z-10">
                                                    <label className="text-xs font-bold text-gray-500 uppercase cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                                                        {p.habilitada !== false ? "Activa" : "Inactiva"}
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        checked={p.habilitada !== false}
                                                        onChange={(e) => handleToggleHabilitada(etapa, idx, e.target.checked)}
                                                        className="w-4 h-4 cursor-pointer accent-blue-600"
                                                    />
                                                </div>

                                                <div className="mb-4 pr-32">
                                                    <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Pregunta {idx + 1}</label>
                                                    <input
                                                        className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-400 outline-none font-medium bg-white"
                                                        value={p.pregunta}
                                                        onChange={(e) => handleEditPreguntaTexto(etapa, idx, e.target.value)}
                                                        placeholder="Escribe la pregunta aquí..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {p.opciones.map((opcion, optIdx) => (
                                                        <div
                                                            key={optIdx}
                                                            className={`p-3 rounded-lg border-2 transition-colors ${
                                                                opcion === p.correcta ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`correcta-${etapa}-${idx}`}
                                                                    checked={opcion === p.correcta}
                                                                    onChange={() => handleSetCorrecta(etapa, idx, opcion)}
                                                                    className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
                                                                />
                                                                <label
                                                                    className="text-xs font-bold text-gray-500 uppercase cursor-pointer"
                                                                    onClick={() => handleSetCorrecta(etapa, idx, opcion)}
                                                                >
                                                                    {opcion === p.correcta ? 'Correcta' : 'Opción'}
                                                                </label>
                                                            </div>
                                                            <input
                                                                className="w-full border border-gray-300 p-2 rounded text-sm focus:border-green-400 outline-none"
                                                                value={opcion}
                                                                onChange={(e) => handleEditOpcion(etapa, idx, optIdx, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleNuevaPregunta(etapa)}
                                        className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>➕</span> Añadir Nueva Pregunta a Etapa {etapa}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherPanel;