// src/config.js

/**
 * @file Centraliza las constantes y configuraciones del juego para fácil mantenimiento.
 */

// Se recomienda usar variables de entorno para la URL de la API en producción.
export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Configuración del juego
export const GAME_TICK_INTERVAL = 3000; // ms
export const RESOURCE_DECREASE_RATE = 2;
export const RESOURCE_INCREASE_ON_DROP = 20;
export const RESOURCE_INCREASE_ON_SHAKE = 10;
export const MAX_RESOURCE_LEVEL = 100;
export const INITIAL_RESOURCE_LEVEL = 50;

// Lógica de crecimiento
export const MIN_GROWTH_LEVEL = 65;
export const MAX_GROWTH_LEVEL = 90;
export const MAX_PLANT_STAGE = 19;

// Detección de "shake"
export const SHAKE_TIME_THRESHOLD = 300; // ms
export const SHAKE_DISTANCE_THRESHOLD = 15; // px
export const SHAKE_COUNT_THRESHOLD = 3;
