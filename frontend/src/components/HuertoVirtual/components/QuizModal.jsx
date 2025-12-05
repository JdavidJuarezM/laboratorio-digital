// client/src/components/HuertoVirtual/components/QuizModal.jsx

import React, {useState, useEffect, memo} from "react";
import {motion} from "framer-motion";
import PropTypes from "prop-types";

const QuizModal = memo(({pregunta, onRespuesta}) => {
    const [feedback, setFeedback] = useState("");

    // Este efecto se activa CADA VEZ que el estado 'feedback' cambia.
    useEffect(() => {
        // Si el feedback no está vacío (es decir, el usuario acaba de responder)...
        if (feedback) {
            // Creamos un timer para cerrar el modal después de 1.5 segundos.
            const timer = setTimeout(() => {
                const esCorrecta = feedback === "¡Correcto!";
                onRespuesta(esCorrecta);
                // No necesitamos limpiar el feedback aquí, porque el componente se desmontará.
            }, 1500);

            // Función de limpieza: si el componente se desmonta antes de tiempo,
            // cancelamos el timer para evitar errores.
            return () => clearTimeout(timer);
        }
    }, [feedback, onRespuesta]); // Dependencias del efecto

    const handleOpcionClick = (opcion) => {
        // Ahora el click solo se encarga de establecer el feedback.
        // El useEffect se encargará del resto.
        const esCorrecta = opcion === pregunta.correcta;
        setFeedback(esCorrecta ? "¡Correcto!" : "Inténtalo de nuevo");
    };

    // Si no hay pregunta, no renderizamos nada para evitar errores.
    if (!pregunta) {
        return null;
    }

    return (
        <motion.div
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md text-center"
                initial={{scale: 0.7, y: 50}}
                animate={{scale: 1, y: 0}}
                transition={{type: "spring", stiffness: 300, damping: 20}}
            >
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                    {pregunta.pregunta}
                </h2>
                <div className="grid grid-cols-1 gap-3 my-6">
                    {pregunta.opciones.map((opcion) => (
                        <button
                            key={opcion} // Usar la opción como key es más seguro si no hay repetidas
                            onClick={() => handleOpcionClick(opcion)}
                            disabled={!!feedback}
                            className="bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {opcion}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <p
                        className={`text-xl font-bold ${
                            feedback === "¡Correcto!" ? "text-green-400" : "text-red-400"
                        }`}
                    >
                        {feedback}
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
});

QuizModal.propTypes = {
    // Definimos la "forma" que debe tener el objeto 'pregunta'
    pregunta: PropTypes.shape({
        pregunta: PropTypes.string.isRequired,
        opciones: PropTypes.arrayOf(PropTypes.string).isRequired,
        correcta: PropTypes.string.isRequired,
    }),
    onRespuesta: PropTypes.func.isRequired,
};

QuizModal.displayName = "QuizModal";

export default QuizModal;
