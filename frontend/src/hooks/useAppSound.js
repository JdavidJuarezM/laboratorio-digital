// client/src/hooks/useAppSound.js

import useSound from "use-sound";
import { useCallback } from "react";

// --- Archivos de sonido que deberás añadir a tu carpeta /public ---
import clickSound from "/sounds/click.mp3";
import hoverSound from "/sounds/hover.mp3";

/**
 * Hook centralizado para manejar los sonidos de la UI.
 * @returns {object} - Un objeto con funciones para reproducir sonidos.
 */
export const useAppSound = () => {
  // Opciones para los sonidos
  const soundOptions = {
    volume: 0.5,
    interrupt: true, // Permite que el sonido se reinicie si se dispara rápidamente
  };

  const [playClick] = useSound(clickSound, soundOptions);
  const [playHover] = useSound(hoverSound, { ...soundOptions, volume: 0.2 });

  // Usamos useCallback para que estas funciones no se creen en cada render
  const handleMouseEnter = useCallback(() => {
    playHover();
  }, [playHover]);

  const handleClick = useCallback(() => {
    playClick();
  }, [playClick]);

  return { handleMouseEnter, handleClick };
};
