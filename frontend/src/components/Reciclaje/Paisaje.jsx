// frontend/src/components/Reciclaje/Paisaje.jsx
import React, { useMemo } from 'react';

// Genera un array para los loops de renderizado
const createArray = (length) => [...Array(length)];

const Paisaje = () => {
  // Usamos useMemo para que no se recalculen en cada render
  const motes = useMemo(() => createArray(20).map((_, i) => (
    <div
      key={`mote-${i}`}
      className="mote"
      style={{
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
      }}
    />
  )), []);

  const stars = useMemo(() => createArray(30).map((_, i) => (
    <div
      key={`star-${i}`}
      className="star"
      style={{
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    />
  )), []);

  return (
    <div className="landscape-background">
      <div id="motes">{motes}</div>
      <div id="stars">{stars}</div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="bird bird-1"></div>
      <div className="bird bird-2"></div>
      <div className="bird bird-3"></div>
      <div className="landscape-layer layer-1"></div>
      <div className="landscape-layer layer-2"></div>
      <div className="landscape-layer layer-3"></div>
    </div>
  );
};

// Usamos React.memo porque este componente nunca cambiará sus props
export default React.memo(Paisaje);