// javascript
// file: `frontend/src/components/Reciclaje/BoteIconos.jsx`
import React from 'react';

// Reemplazamos los SVGs complejos por componentes que renderizan emojis.
// Los props (width, height, className) se ignoran o se aplican a un span.

export const IconoReciclaje = ({ className = '' }) => (
  <span className={className} role="img" aria-label="Reciclaje">
    ♻️
  </span>
);

export const BotelladePlastico = ({ className = '' }) => (
  <span className={className} role="img" aria-label="Botella">
    🍼
  </span>
);

export const IconoVidrio = ({ className = '' }) => (
  <span className={className} role="img" aria-label="Vidrio">
    🍾
  </span>
);