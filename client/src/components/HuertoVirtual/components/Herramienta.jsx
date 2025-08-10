// client/src/components/HuertoVirtual/components/Herramienta.jsx

import React, { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { TOOL_TYPES } from "../../../constants/gameConfig";
import PropTypes from "prop-types";
import clsx from "clsx"; // Importamos clsx para manejar las clases

const Herramienta = memo(
  ({ id, type, isDraggingActive, isCurrentlyDragged, needsAttention }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          zIndex: 100,
        }
      : undefined;

    const toolInfo = TOOL_TYPES[type];

    if (!toolInfo) {
      console.error(`Tipo de herramienta no encontrado en gameConfig: ${type}`);
      return null;
    }

    // Lógica de clases mucho más limpia con clsx
    const containerClasses = clsx(
      "w-20 h-20 bg-gray-800 rounded-xl flex flex-col items-center justify-center",
      "cursor-grab active:cursor-grabbing transition-all duration-200 text-white border-2",
      {
        "animate-pulse border-green-400": isCurrentlyDragged, // Renombrada de 'isShaking' para mayor claridad
        "border-transparent": !isCurrentlyDragged,
        "animate-bounce": needsAttention && !isDraggingActive,
        "scale-110 opacity-80 shadow-2xl": isDraggingActive,
        "hover:bg-gray-700": !isDraggingActive,
      }
    );

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={containerClasses}
      >
        <i className={`fa-solid ${toolInfo.icon} ${toolInfo.color} text-3xl`} />
        <span className="text-sm capitalize">{toolInfo.name}</span>
      </div>
    );
  }
);

Herramienta.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["agua", "sol"]).isRequired,
  isDraggingActive: PropTypes.bool.isRequired,
  isCurrentlyDragged: PropTypes.bool.isRequired, // Prop renombrada para mayor claridad
  needsAttention: PropTypes.bool,
};

Herramienta.displayName = "Herramienta";

export default Herramienta;
