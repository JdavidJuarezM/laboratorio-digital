// frontend/src/components/Reciclaje/Bote.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Bote = ({ id, label, icon, color }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  // Clases dinámicas para el bote
  const binClasses = [
    'bin',
    color,
    'p-4',
    'rounded-xl',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'text-white',
    isOver ? 'bin-drag-over' : '' // Clase para la tapa abierta
  ].join(' ');

  return (
    <div ref={setNodeRef} id={id} data-bin={id} className={binClasses}>
      <div className="pt-4">
        {/* El icono y el texto están envueltos */}
        <div
          className="text-5xl bin-icon"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
        <div className="text-sm md:text-lg font-bold text-center mt-2">
          {label}
        </div>
      </div>
    </div>
  );
};

// Usamos React.memo para optimizar, ya que los botes no cambian
export default React.memo(Bote);