// frontend/src/components/Reciclaje/Basura.jsx
import React, { useMemo, forwardRef } from 'react';
import { useDraggable } from '@dnd-kit/core';

export const BasuraVisual = forwardRef(({ item, isDragging, ...props }, ref) => {
  const randomRotation = useMemo(() => Math.floor(Math.random() * 20) - 10, [item]);

  let iconElement = null;
  if (item?.icon) {
    iconElement = (
      <span className="text-7xl filter drop-shadow-md" role="img" aria-label={item?.name || ''}>
        {item.icon}
      </span>
    );
  }

  const hasIcon = !!iconElement;

  // Clases dinámicas para un look más "tarjeta de juego"
  const itemClasses = [
    // Base: Tarjeta blanca suave con bordes muy redondeados y sombra
    'relative',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'w-32', // Ancho fijo para consistencia
    'h-36', // Alto fijo
    'bg-white', // Fondo blanco
    'rounded-[2rem]', // Bordes muy redondos (estilo iOS/Modern)
    'shadow-[0_8px_0_rgba(0,0,0,0.1)]', // Sombra sólida estilo 3D cartoon
    'border-4', // Borde grueso
    'border-white',
    'transform',
    'transition-all',
    'duration-200',
    'cursor-grab',
    'active:cursor-grabbing',
    hasIcon ? 'has-icon' : '',
    // Estilos específicos por tipo
    item?.type === 'danger' ? 'danger-item bg-red-50 border-red-200' : '',
    item?.type === 'powerup' ? 'powerup-item bg-amber-50 border-amber-200' : '',
    isDragging ? 'dragging scale-110 rotate-12 z-50 shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'hover:-translate-y-1'
  ].join(' ').trim();

  return (
    <div
      ref={ref}
      id="currentItem"
      className={itemClasses}
      style={{
        '--random-rotation': `${randomRotation}deg`,
        // Si no se está arrastrando, aplicamos la rotación aleatoria para que se vea natural
        transform: !isDragging ? `rotate(${randomRotation}deg)` : undefined
      }}
      {...props}
    >
      {/* Brillo decorativo */}
      <div className="absolute top-2 right-2 w-4 h-4 bg-white/50 rounded-full blur-[1px]"></div>

      {hasIcon ? (
        <>
          <div className="icon-container transform transition-transform group-hover:scale-110" aria-hidden={false}>
            {iconElement}
          </div>
          <div className={`text-center font-black text-sm mt-2 px-2 leading-tight ${
            item?.type === 'danger' ? 'text-red-500' : 'text-slate-600'
          }`}>
              {item?.name}
          </div>
        </>
      ) : (
        <div className="text-center font-bold text-gray-800 text-lg">
          {item?.name}
        </div>
      )}
    </div>
  );
});

const Basura = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item?.name || `item-${Math.random()}`,
    data: { current: item }, // Pasamos el item completo en 'data.current'
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999, // Asegurar que esté por encima de todo al arrastrar
        position: 'relative' // Necesario para el z-index
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none">
        {/* Si se está arrastrando, ocultamos el original para mostrar solo el DragOverlay (opcional, o bajamos opacidad) */}
       <div className={isDragging ? 'opacity-0' : 'opacity-100'}>
          <BasuraVisual item={item} />
       </div>
    </div>
  );
};

export default Basura;