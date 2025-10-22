import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three"; // <-- LÍNEA AÑADIDA

// El resto del código que ya tenías
const Shape = ({ geometry, material, position, scale }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.1;
    ref.current.rotation.y += delta * 0.2;
  });
  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      geometry={geometry}
      material={material}
    />
  );
};

const Scene = () => {
  const shapes = useMemo(() => {
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.ConeGeometry(0.6, 1.2, 32),
      new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    ];
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 }),
    ];

    return Array.from({ length: 40 }).map(() => {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const position = [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
      ];
      const scale = Math.random() * 0.5 + 0.5;
      return { geometry, material, position, scale };
    });
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight color="white" position={[5, 10, 7]} intensity={0.8} />
      {shapes.map((props, i) => (
        <Shape key={i} {...props} />
      ))}
    </>
  );
};

const ThreeJSBackground = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    >
      <Scene />
    </Canvas>
  );
};

export default ThreeJSBackground;
