// javascript
// frontend/src/components/Reciclaje/Basura.jsx
import React, {useMemo, forwardRef} from 'react';
import {useDraggable} from '@dnd-kit/core';

export const BasuraVisual = forwardRef(({item, isDragging, ...props}, ref) => {
    const randomRotation = useMemo(() => Math.floor(Math.random() * 20) - 10, [item]);

    // MODIFICADO: El icono ahora viene de item.icon (renombrado de item.svg en constants.js)
    // y es un emoji.
    let iconElement = null;
    if (item?.icon) {
        iconElement = (
            <span className="text-6xl" role="img" aria-label={item?.name || ''}>
        {item.icon}
      </span>
        );
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


    return (
        <div
            ref={ref}
            id="currentItem"
            className={itemClasses}
            style={{'--random-rotation': `${randomRotation}deg`}}
            {...props}
        >
            {hasIcon ? (
                <>
                    <div className="icon-container" aria-hidden={false}>
                        {iconElement}
                    </div>
                    <div className="text-center font-medium text-gray-800 text-lg mt-1 item-name">
                        {item?.name}
                    </div>
                </>
            ) : (
                <>
                    {/* Fallback por si algo no tiene icono */}
                    <div className="text-center font-medium text-gray-800 text-lg mt-1 item-name">
                        {item?.name}
                    </div>
                </>
            )}
        </div>
    );
});

const Basura = ({item}) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
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
