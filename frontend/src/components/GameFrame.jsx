// src/components/GameFrame.jsx

import React from "react";
import {useNavigate} from "react-router-dom";
import soundService from "../services/soundService";
import {LogoutIcon} from "./Icons";

const GameFrame = ({children, title}) => {
    const navigate = useNavigate();

    const handleExitGame = () => {
        soundService.playClick();
        navigate("/dashboard");
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-white">{title}</h2>
                <button
                    onClick={handleExitGame}
                    className="inline-flex items-center gap-2 bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                    <LogoutIcon className="h-5 w-5 rotate-180"/>{" "}

                    Salir del Juego
                </button>
            </div>
            <div className="flex-grow">
                {children}
            </div>
        </div>
    );
};

export default GameFrame;
