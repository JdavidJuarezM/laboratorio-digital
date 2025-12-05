// frontend/src/components/common/ThreeJSBackground.jsx
import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';

const ThreeJSBackground = () => {
    const mountRef = useRef(null); // Ref para el <canvas>

    useEffect(() => {
        // --- Esta es la lógica del HTML, adaptada a React ---
        const canvas = mountRef.current;
        if (!canvas) return;

        let animationId; // Para guardar el ID de la animación y poder limpiarla
        const scene = new THREE.Scene();

        // Fondo oscuro (0x111827 es 'bg-gray-900' de Tailwind)
        scene.background = new THREE.Color(0x111827);
        scene.fog = new THREE.Fog(0x111827, 10, 30); // Niebla

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7).normalize();
        scene.add(directionalLight);

        const objects = [];
        const geometryBox = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const geometrySphere = new THREE.SphereGeometry(0.4, 32, 32);

        // Paleta de colores
        const materials = [
            new THREE.MeshStandardMaterial({color: 0x9333ea, metalness: 0.1, roughness: 0.6}), // Morado
            new THREE.MeshStandardMaterial({color: 0xec4899, metalness: 0.1, roughness: 0.6}), // Rosa/Fucsia
            new THREE.MeshStandardMaterial({color: 0xd8b4fe, metalness: 0.1, roughness: 0.6}), // Morado claro
            new THREE.MeshStandardMaterial({color: 0xf97316, metalness: 0.1, roughness: 0.6}), // Naranja
            new THREE.MeshStandardMaterial({color: 0x3b82f6, metalness: 0.1, roughness: 0.6})  // Azul
        ];

        for (let i = 0; i < 70; i++) {
            let geometry = Math.random() < 0.5 ? geometryBox : geometrySphere;
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 30;
            mesh.position.y = (Math.random() - 0.5) * 30;
            mesh.position.z = (Math.random() - 0.5) * 30;
            const scale = 0.7 + Math.random() * 0.6;
            mesh.scale.set(scale, scale, scale);
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003
            };
            mesh.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005
            );
            scene.add(mesh);
            objects.push(mesh);
        }

        // --- Manejador de Redimensión ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        const clock = new THREE.Clock();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            objects.forEach(obj => {
                obj.rotation.x += obj.userData.rotationSpeed.x;
                obj.rotation.y += obj.userData.rotationSpeed.y;
                obj.rotation.z += obj.userData.rotationSpeed.z;
                obj.position.x += obj.userData.velocity.x;
                obj.position.y += obj.userData.velocity.y;
                obj.position.z += obj.userData.velocity.z;
                if (Math.abs(obj.position.x) > 15) obj.userData.velocity.x *= -1;
                if (Math.abs(obj.position.y) > 15) obj.userData.velocity.y *= -1;
                if (Math.abs(obj.position.z) > 15) obj.userData.velocity.z *= -1;
                obj.position.y += Math.sin(elapsedTime + obj.position.x) * 0.001;
            });

            camera.position.x = Math.sin(elapsedTime * 0.05) * 0.5;
            camera.position.y = Math.cos(elapsedTime * 0.05) * 0.5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate(); // Iniciar animación

        // --- Función de Limpieza ---
        // Esto es importante en React para evitar fugas de memoria
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            renderer.dispose();
        };
    }, []); // El array vacío [] asegura que esto se ejecute solo una vez

    return (
        <canvas
            ref={mountRef}
            style={{
                position: 'fixed', // 'fixed' o 'absolute'
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1 // Se pone detrás de todo
            }}
        />
    );
};

export default ThreeJSBackground;
