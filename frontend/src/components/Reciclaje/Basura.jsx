// frontend/src/components/Reciclaje/Basura.jsx
import React, { useMemo, forwardRef } from 'react';
import { useDraggable } from '@dnd-kit/core';

// 1. Componente VISUAL. No sabe nada de dnd-kit.
// Lo usamos para el 'DragOverlay' y para el 'Basura' original.
export const BasuraVisual = forwardRef(({ item, isDragging, ...props }, ref) => {
  const randomRotation = useMemo(() => Math.floor(Math.random() * 20) - 10, [item]);

  const itemClasses = [
    'bg-white',
    'p-4',
    'rounded-lg',
    'transform',
    // 'transition-all', // Esta línea la quitamos antes para evitar el lag
    item.type === 'danger' ? 'danger-item' : '',
    item.type === 'powerup' ? 'powerup-item' : '',
    isDragging ? 'dragging' : '' // 'dragging' se aplica si se le indica
  ].join(' ');

  return (
    <div
      ref={ref}
      id="currentItem"
      className={itemClasses}
      style={{ '--random-rotation': `${randomRotation}deg` }}
      {...props} // Aquí se pasan los {...listeners} y {...attributes}
    >
      <div
        className="trash-svg-container"
        dangerouslySetInnerHTML={{ __html: item.svg }}
      />
      <div className="text-center font-medium text-gray-800 mt-2">
        {item.name}
      </div>
    </div>
  );
});

// 2. Componente 'Basura' que usa el hook y controla el original
const Basura = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.name,
    data: item, // Pasamos el item completo como data
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        // dnd-kit oculta el original, pero por si acaso, lo forzamos
        visibility: isDragging ? 'hidden' : 'visible',
      }
    : undefined;

  // Renderiza el componente visual con las propiedades del hook
  return (
    <BasuraVisual
      ref={setNodeRef}
      style={style}
      item={item}
      isDragging={isDragging}
      {...listeners}
      {...attributes}
    />
  );
};

export default Basura;