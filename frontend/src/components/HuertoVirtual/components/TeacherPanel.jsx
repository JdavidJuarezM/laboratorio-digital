// frontend/src/components/HuertoVirtual/components/TeacherPanel.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { bancoDePreguntas as preguntasDefault } from "../../../constants/bancoDePreguntas";
import { getAlumnos, crearAlumno, eliminarAlumno } from "../../../services/alumnosService";

const DEFAULT_CONFIG = {
  codigoMaestro: import.meta.env.VITE_TEACHER_CODE,
};

const TeacherPanel = ({ onClose, isOpen }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [preguntas, setPreguntas] = useState(preguntasDefault);
  const [alumnos, setAlumnos] = useState([]);
  const [nuevoAlumno, setNuevoAlumno] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar alumnos desde BD al autenticarse
  useEffect(() => {
    if (isAuthenticated) {
      cargarAlumnos();
    }
  }, [isAuthenticated]);

  // Cargar preguntas locales (estas se mantienen en local por ahora para no complicar el backend)
  useEffect(() => {
    const savedQuestions = localStorage.getItem("huerto_preguntas");
    if (savedQuestions) {
        try {
            const parsed = JSON.parse(savedQuestions);
            if(parsed && typeof parsed === 'object') setPreguntas(parsed);
        } catch(e) { console.error(e); }
    }
  }, []);

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const data = await getAlumnos();
      setAlumnos(data);
    } catch (error) {
      console.error("Error cargando alumnos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === DEFAULT_CONFIG.codigoMaestro) {
      setIsAuthenticated(true);
    } else {
      alert("Código incorrecto");
    }
  };

  const handleGuardarPreguntas = () => {
    localStorage.setItem("huerto_preguntas", JSON.stringify(preguntas));
    alert("¡Preguntas guardadas exitosamente!");
  };

  const handleAgregarAlumno = async (e) => {
    e.preventDefault();
    if (!nuevoAlumno.trim()) return;
    try {
      await crearAlumno(nuevoAlumno.trim());
      await cargarAlumnos();
      setNuevoAlumno("");
    } catch (error) {
      alert("Error al crear alumno");
    }
  };

  const handleEliminarAlumno = async (id) => {
    if (window.confirm("¿Estás seguro? Se borrará de la base de datos permanentemente.")) {
      try {
        await eliminarAlumno(id);
        await cargarAlumnos();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleEditPregunta = (etapa, index, field, value) => {
    const nuevasPreguntas = { ...preguntas };
    if(nuevasPreguntas[etapa] && nuevasPreguntas[etapa][index]) {
        nuevasPreguntas[etapa][index][field] = value;
        setPreguntas(nuevasPreguntas);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">👨‍🏫 Panel de Maestro (Base de Datos)</h2>
          <button onClick={onClose} className="text-white text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
               <div className="bg-white p-8 rounded-xl shadow border">
                   <h3 className="text-xl font-bold mb-4 text-center">Acceso Maestro</h3>
                   <form onSubmit={handleLogin} className="flex gap-2">
                      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 rounded w-full" placeholder="Código..." autoFocus />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Entrar</button>
                   </form>
               </div>
            </div>
          ) : (
            <div className="flex h-full">
               <div className="w-64 bg-gray-100 p-4 border-r">
                  <button onClick={() => setActiveTab('dashboard')} className={`block w-full text-left p-3 mb-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>📊 Alumnos</button>
                  <button onClick={() => setActiveTab('preguntas')} className={`block w-full text-left p-3 rounded ${activeTab === 'preguntas' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}>📝 Preguntas</button>
               </div>
               <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                  {activeTab === 'dashboard' && (
                    <div className="animate-fadeIn">
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">Mis Alumnos</h3>
                      <form onSubmit={handleAgregarAlumno} className="flex gap-2 mb-6 bg-white p-4 rounded shadow-sm">
                        <input value={nuevoAlumno} onChange={e=>setNuevoAlumno(e.target.value)} className="border p-2 rounded flex-1 outline-none focus:ring-2 focus:ring-green-200" placeholder="Nombre del alumno..." />
                        <button className="bg-green-600 text-white px-6 rounded font-bold hover:bg-green-700">Agregar</button>
                      </form>
                      {loading ? <p>Cargando lista...</p> : (
                        <div className="bg-white rounded shadow overflow-hidden">
                            <table className="w-full text-left">
                            <thead className="bg-slate-100"><tr><th className="p-3">Nombre</th><th className="p-3">Progreso</th><th className="p-3 text-right">Acción</th></tr></thead>
                            <tbody>
                                {alumnos.map(a => (
                                <tr key={a.id} className="border-b hover:bg-blue-50">
                                    <td className="p-3 font-medium">🎓 {a.nombre}</td>
                                    <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Etapa {a.etapa}</span></td>
                                    <td className="p-3 text-right"><button onClick={() => handleEliminarAlumno(a.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Eliminar</button></td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                            {alumnos.length === 0 && <p className="p-6 text-center text-gray-400">No hay alumnos.</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'preguntas' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-2xl font-bold text-slate-800">Preguntas</h3>
                            <button onClick={handleGuardarPreguntas} className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-700">Guardar</button>
                        </div>
                        {Object.keys(preguntas).map(etapa => (
                            <div key={etapa} className="bg-white p-4 rounded shadow mb-4 border border-gray-200">
                                <h4 className="font-bold text-orange-600 mb-2">Etapa {etapa}</h4>
                                {preguntas[etapa].map((p, idx) => (
                                    <div key={idx} className="mb-3 p-3 bg-slate-50 rounded border border-slate-100">
                                        <div className="mb-2">
                                            <label className="text-xs font-bold text-gray-500">Pregunta</label>
                                            <input className="w-full border p-2 rounded" value={p.pregunta} onChange={(e) => handleEditPregunta(etapa, idx, 'pregunta', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500">Respuesta Correcta</label>
                                            <input className="w-full border p-2 rounded bg-green-50 text-green-800" value={p.correcta} onChange={(e) => handleEditPregunta(etapa, idx, 'correcta', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
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