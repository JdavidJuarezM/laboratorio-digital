import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TOOL_TYPES } from "../constants/gameConfig"; // Correcto

const Herramienta = ({
  id,
  type,
  isDraggingActive,
  isShaking,
  needsAttention,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
      }
    : undefined;

  // Se busca la info de la herramienta en la configuración central
  const toolInfo = TOOL_TYPES[type];

  // Si el tipo de herramienta no existe, no renderizamos nada para evitar un error.
  if (!toolInfo) {
    console.error(`Tipo de herramienta no encontrado en gameConfig: ${type}`);
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-20 h-20 bg-gray-800 rounded-xl flex flex-col items-center justify-center
      cursor-grab active:cursor-grabbing transition-all duration-200 text-white
      
     
      ${
        isShaking
          ? "animate-pulse border-2 border-green-400"
          : "border-2 border-transparent"
      }
      ${needsAttention && !isDraggingActive ? "animate-bounce" : ""} 
      ${
        isDraggingActive
          ? "scale-110 opacity-80 shadow-2xl"
          : "hover:bg-gray-700"
      }
      `}
    >
      <i className={`fa-solid ${toolInfo.icon} ${toolInfo.color} text-3xl`} />
      <span className="text-sm capitalize">{toolInfo.name}</span>
    </div>
  );
};

export default Herramienta;
