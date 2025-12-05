// frontend/src/components/Reciclaje/WelcomeModal.jsx
import React from 'react';
import {motion} from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const WelcomeModal = ({onStart}) => {
    const {width, height} = useWindowSize();

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <Confetti
                width={width}
                height={height}
                numberOfPieces={100}
                recycle={false}
                gravity={0.1}
            />
            <motion.div
                className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full"
                initial={{scale: 0.7, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{type: 'spring', stiffness: 300, damping: 20}}
            >
                <h1 className="text-3xl md:text-5xl font-bold text-green-700 mb-4">
                    ¡Bienvenido a Misión Reciclaje!
                </h1>
                <div className="text-lg text-gray-700 space-y-3 my-6">
                    <p>
                        Arrastra cada objeto de basura al contenedor del color correcto.
                    </p>
                    <p>
                        ¡Pero CUIDADO con las bombas! 💣
                    </p>
                    <p>
                        Consigue una racha de <strong>10</strong> para entrar en
                        <strong className="fever-mode-streak p-1 rounded-md">¡Modo Racha!</strong> 🔥
                    </p>
                </div>
                <button
                    onClick={onStart}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-2xl shadow-lg transition-transform transform hover:scale-105"
                >
                    ¡Empezar a Jugar!
                </button>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeModal;