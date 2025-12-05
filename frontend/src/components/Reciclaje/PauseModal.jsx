// frontend/src/components/Reciclaje/PauseModal.jsx
import React from 'react';
import {motion} from 'framer-motion';

const PauseModal = ({onResume}) => {
    return (
        <motion.div
            id="pauseModal"
            // AGREGADO: style={{ pointerEvents: 'auto' }} para sobreescribir el CSS y permitir clics
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
            style={{pointerEvents: 'auto'}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className="text-white text-center"
                initial={{scale: 0.7, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type: 'spring', stiffness: 300, damping: 20}}
            >
                <h2 className="text-6xl font-bold mb-4">PAUSA</h2>
                <p className="text-3xl">¡Tómate un respiro!</p>
                <button
                    id="resumeModalBtn"
                    className="text-white cursor-pointer" // Aseguramos cursor pointer
                    onClick={(e) => {
                        e.stopPropagation(); // Buena práctica para evitar propagación
                        onResume();
                    }}
                >
                    ¡Reanudar!
                </button>
            </motion.div>
        </motion.div>
    );
};

export default PauseModal;