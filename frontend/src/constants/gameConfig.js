// client/src/constants/gameConfig.js


const API_URL = import.meta.env.VITE_API_URL;

export const GAME_CONFIG = {
    API_BASE_URL: API_URL || "/api",
    INITIAL_RESOURCE_LEVEL: 50,
    RESOURCE_DECREASE_RATE: 5,
    GAME_TICK_INTERVAL_MS: 3000,
    RESOURCE_INCREASE_ON_DROP: 25,
    RESOURCE_INCREASE_ON_SHAKE: 15,
    MAX_RESOURCE_LEVEL: 100,
    GROWTH_THRESHOLD: {MIN: 60, MAX: 95},
    MAX_PLANT_STAGE: 4,
    SHAKE_DETECTION: {TIME_MS: 300, DISTANCE_PX: 15, COUNT: 3},
    SAVING_INDICATOR_DELAY_MS: 500,
};

export const nombresEtapas = [
    "Germinación",
    "Desarrollo vegetativo",
    "Floración",
    "Desarrollo de frutos y semillas",
    "Maduración y senescencia",
];

export const TOOL_TYPES = {
    agua: {
        name: "Agua",
        icon: "💧",
        color: "text-blue-400",
    },
    sol: {
        name: "Sol",
        icon: "☀️",
        color: "text-yellow-400",
    },
};


export const WEATHER_TYPES = {
    SUNNY: {
        id: 'sunny',
        name: 'Soleado',
        emoji: '☀️',
        waterMod: 1,
        message: 'Un día tranquilo y soleado.'
    },
    RAINY: {
        id: 'rainy',
        name: 'Lluvia',
        emoji: '🌧️',
        waterMod: -2,
        message: '¡Está lloviendo! Tu planta se riega sola.'
    },
    HEATWAVE: {
        id: 'heatwave',
        name: 'Ola de Calor',
        emoji: '🔥',
        waterMod: 2.5,
        message: '¡Mucho calor! Tu planta necesita más agua.'
    },
};