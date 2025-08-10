export const GAME_CONFIG = {
  API_BASE_URL: "http://localhost:5000/api",
  INITIAL_RESOURCE_LEVEL: 50,
  RESOURCE_DECREASE_RATE: 5,
  GAME_TICK_INTERVAL_MS: 3000,
  RESOURCE_INCREASE_ON_DROP: 25,
  RESOURCE_INCREASE_ON_SHAKE: 15,
  MAX_RESOURCE_LEVEL: 100,
  GROWTH_THRESHOLD: { MIN: 60, MAX: 95 },
  MAX_PLANT_STAGE: 4,
  SHAKE_DETECTION: { TIME_MS: 300, DISTANCE_PX: 15, COUNT: 3 },
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
    icon: "fa-droplet",
    color: "text-blue-400",
  },
  sol: {
    name: "Sol",
    icon: "fa-sun",
    color: "text-yellow-400",
  },
};
