// frontend/src/components/HuertoVirtual/components/StudentSelector.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAlumnos } from '../../../services/alumnosService';

const StudentSelector = ({ onSelect, onCancel }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumnos = async () => {
        try {
            const data = await getAlumnos();
            setAlumnos(data);
        } catch (error) {
            console.error("Error cargando alumnos:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchAlumnos();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border-4 border-blue-100 flex flex-col max-h-[80vh]">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">¿Quién va a jugar?</h2>
        <p className="text-gray-500 mb-6">Selecciona tu nombre para cargar tu progreso</p>

        {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto p-2 custom-scrollbar flex-1">
            {alumnos.length > 0 ? (
                alumnos.map((alumno) => (
                <button
                    key={alumno.id}
                    onClick={() => onSelect(alumno)}
                    className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-800 font-bold py-4 px-4 rounded-xl transition-all flex flex-col items-center gap-2 hover:shadow-md hover:scale-105"
                >
                    <span className="text-4xl">🧑‍🌾</span>
                    <span className="truncate w-full text-sm md:text-base">{alumno.nombre}</span>
                    <span className="text-xs text-gray-500 font-normal">Nivel {alumno.etapa}</span>
                </button>
                ))
            ) : (
                <div className="col-span-2 text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p>No hay alumnos registrados.</p>
                    <p className="text-xs mt-2">El maestro debe agregarte primero.</p>
                </div>
            )}
            </div>
        )}

        <button onClick={onCancel} className="mt-6 text-gray-500 hover:text-red-500 underline font-semibold">
          Cancelar / Volver
        </button>
      </motion.div>
    </div>
  );
};

export default StudentSelector;