// frontend/src/components/Reciclaje/Basura.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Basura = ({ item }) => {
  // Usamos el nombre como ID, asumiendo que es único.
  // Si no lo es, deberíamos usar un ID único (ej. item.id)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.name,
  });

  // Estilo dinámico para el arrastre
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100, // Asegura que esté por encima de todo al arrastrar
  } : undefined;

  // Clases dinámicas para el objeto
  const itemClasses = [
    'bg-white',
    'p-4',
    'rounded-lg',
    'transform',
    'transition-all',
    item.type === 'danger' ? 'danger-item' : '',
    item.type === 'powerup' ? 'powerup-item' : '',
    isDragging ? 'dragging' : '' // Clase para cuando se está arrastrando
  ].join(' ');

  // Rotación aleatoria para la animación 'idleBob'
  const randomRotation = React.useMemo(() => Math.floor(Math.random() * 20) - 10, [item]);

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, '--random-rotation': `${randomRotation}deg` }}
      {...listeners}
      {...attributes}
      id="currentItem" // Mantenemos el ID para las animaciones CSS
      className={itemClasses}
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
};

export default Basura;