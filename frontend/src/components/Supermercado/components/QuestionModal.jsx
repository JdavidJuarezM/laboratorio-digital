// client/src/components/Supermercado/components/QuestionModal.jsx
import React, {useState, useEffect, useRef} from "react";
import {ICONS} from "../constants/gameData";

const QuestionModal = ({questionData, onSubmit, onClose}) => {
    const [answer, setAnswer] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const inputRef = useRef(null);

    // Enfocar el input cuando el modal aparece
    useEffect(() => {
        if (questionData && inputRef.current) {
            inputRef.current.focus();
        }
    }, [questionData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!answer) return;

        const isCorrect = parseFloat(answer) === questionData.answer;
        if (isCorrect) {
            onSubmit(answer);
            setAnswer("");
        } else {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    if (!questionData) return null;

    return (
        <div className="modal-base fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <form
                onSubmit={handleSubmit}
                className={`rounded-2xl p-6 sm:p-8 w-full max-w-md text-center transform transition-all bg-white border-2 border-gray-300 ${
                    isShaking ? "shake" : ""
                }`}
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    {/* MODIFICADO: Renderiza el emoji como texto */}
                    <div className="flex items-center justify-center w-8 h-8 text-2xl">
                        {ICONS[questionData.type] || ""}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        ¡Desafío Matemático!
                    </h2>
                </div>
                <p className="text-lg text-gray-700 mb-6 min-h-[50px]">
                    {questionData.question}
                </p>
                <input
                    ref={inputRef}
                    type="number"
                    step="0.01"
                    id="answer-input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-center text-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu respuesta..."
                />
                <div className="mt-6 relative">
                    <button
                        type="submit"
                        className="btn w-full bg-green-500 text-white py-3 px-6 text-lg"
                    >
                        Comprobar
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn w-full mt-2 bg-white text-gray-700 py-2 px-4"
                    >
                        Cerrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionModal;
