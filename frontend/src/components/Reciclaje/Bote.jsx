// frontend/src/components/Reciclaje/Bote.jsx
// javascript
// file: `frontend/src/components/Reciclaje/Bote.jsx`
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Bote = ({ id, label, icon, color }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  const binClasses = [
    'bin',
    color,
    'p-5',
    'rounded-xl',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'text-white',
    isOver ? 'bin-drag-over' : ''
  ].join(' ');

  // MODIFICADO: El icono ahora es un string (emoji)
  let iconNode = (
    <span className="text-5xl">{icon}</span>
  );

  return (
    <div ref={setNodeRef} id={id} data-bin={id} className={binClasses}>
      <div className="pt-4">
        <div className="text-5xl bin-icon">
          {iconNode}
        </div>
        <div className="text-sm md:text-lg font-bold text-center mt-2">
          {label}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Bote);
