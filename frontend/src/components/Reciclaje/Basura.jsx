// javascript
// frontend/src/components/Reciclaje/Basura.jsx
import React, { useMemo, forwardRef } from 'react';
import { useDraggable } from '@dnd-kit/core';

export const BasuraVisual = forwardRef(({ item, isDragging, ...props }, ref) => {
  const randomRotation = useMemo(() => Math.floor(Math.random() * 20) - 10, [item]);

  // Determine iconElement:
  // - prefer item.icon (string URL or React element)
  // - if no item.icon but item.svg is a React element, treat it as the icon
  let iconElement = null;
  if (item?.icon) {
    iconElement = typeof item.icon === 'string'
      ? <img src={item.icon} alt={item?.name || ''} className="mx-auto h-8 w-8" />
      : React.isValidElement(item.icon)
        ? item.icon
        : null;
  } else if (item?.svg && React.isValidElement(item.svg)) {
    iconElement = item.svg;
  }

  const hasIcon = !!iconElement;

  const itemClasses = [
    'bg-white',
    'p-4',
    'rounded-lg',
    'transform',
    hasIcon ? 'has-icon' : '',
    item?.type === 'danger' ? 'danger-item' : '',
    item?.type === 'powerup' ? 'powerup-item' : '',
    isDragging ? 'dragging' : ''
  ].join(' ').trim();

  // Fallback for svg string content (only used when there's no icon)
  let svgElement = null;
  if (!hasIcon && item?.svg) {
    if (typeof item.svg === 'string' && item.svg.trim().startsWith('<svg')) {
      svgElement = <div className="trash-svg-container" dangerouslySetInnerHTML={{ __html: item.svg }} />;
    }
  }

  return (
    <div
      ref={ref}
      id="currentItem"
      className={itemClasses}
      style={{ '--random-rotation': `${randomRotation}deg` }}
      {...props}
    >
      {hasIcon ? (
        <>
          <div className="icon-container" aria-hidden={false}>
            {iconElement}
          </div>
          <span className="sr-only">{item?.name}</span>
        </>
      ) : (
        <>
          {svgElement}
          <div className="text-center font-medium text-gray-800 mt-2 item-name">
            {item?.name}
          </div>
        </>
      )}
    </div>
  );
});

const Basura = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item?.name || `item-${Math.random()}`,
    data: item,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        visibility: isDragging ? 'hidden' : 'visible',
      }
    : undefined;

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

