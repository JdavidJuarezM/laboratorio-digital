// frontend/src/components/Reciclaje/Bote.jsx
import React from 'react';
import {useDroppable} from '@dnd-kit/core';

const Bote = ({id, label, icon, color}) => {
    const {isOver, setNodeRef} = useDroppable({id});

    // Aspecto cuadrado para móvil, ligeramente más alto en PC para elegancia
    const containerClasses = `
    relative w-full aspect-square md:aspect-[4/5] flex flex-col items-center justify-end
    transition-all duration-300 ease-out transform
    ${isOver ? 'scale-105 -translate-y-2' : 'hover:scale-105 hover:-translate-y-1'}
  `;

    const bodyClasses = `
    relative w-full h-[85%] md:h-[90%] rounded-b-2xl md:rounded-b-[2rem] rounded-t-lg md:rounded-t-2xl z-10
    flex flex-col items-center justify-between py-2 md:py-4
    border-b-4 md:border-b-8 border-black/10
    shadow-lg ${color}
    ${isOver ? 'brightness-110 ring-2 md:ring-4 ring-white/50' : ''}
  `;

    return (
        <div ref={setNodeRef} id={id} className={containerClasses}>

            {/* Tapa trasera */}
            <div
                className={`absolute top-2 w-[90%] h-4 md:h-8 rounded-t-lg md:rounded-t-2xl brightness-75 ${color} z-0 translate-y-1 md:translate-y-2 transition-colors`}></div>

            {/* Cuerpo Principal */}
            <div className={bodyClasses}>

                {/* Apertura Oscura */}
                <div
                    className="w-[80%] h-6 md:h-12 bg-slate-900/40 rounded-full shadow-inner mb-0.5 md:mb-2 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/5 blur-sm"></div>
                </div>

                {/* Contenido: Icono y Texto */}
                <div className="flex flex-col items-center justify-center gap-0 w-full px-1 flex-1">
                    {/* Icono: Grande en PC (6xl), Pequeño en móvil (3xl) */}
                    <div
                        className={`text-3xl md:text-6xl filter drop-shadow-md transition-transform duration-300 ${isOver ? 'animate-bounce-custom' : ''}`}>
                        {icon}
                    </div>

                    {/* Etiqueta: Grande en PC, Diminuta en móvil */}
                    <div
                        className="bg-black/20 px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg backdrop-blur-sm border border-white/10 w-full text-center mt-1">
                <span
                    className="text-white font-black text-[8px] md:text-sm uppercase tracking-wider block leading-tight text-shadow-sm truncate">
                    {label}
                </span>
                    </div>
                </div>

                {/* Brillo lateral */}
                <div
                    className="absolute left-1 md:left-2 top-2 md:top-4 w-1 md:w-2 h-[80%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[0.5px]"></div>
            </div>
        </div>
    );
};

export default React.memo(Bote);
