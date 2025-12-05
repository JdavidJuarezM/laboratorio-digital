// frontend/src/components/Reciclaje/constants.js
import {
    IconoReciclaje,
    BotelladePlastico,
} from "./BoteIconos.jsx";

// Tipos de contenedores
export const binData = [
    {
        id: "plastic",
        label: "Plásticos y Latas",
        color: "bg-yellow-400",
        icon: "♻️ 🟡",
    },
    {
        id: "paper",
        label: "Papeles y Cartones",
        icon: "♻️ 🔵",
        color: "bg-blue-500",
    },
    {id: "glass", label: "Vidrio", color: "bg-green-600", icon: "♻️ 🟢"},
    {
        id: "hazardous",
        label: "Residuos Peligrosos",
        color: "bg-red-600",
        icon: "♻️ 🔴",
    },
    {
        id: "organic",
        label: "Orgánicos",
        color: "bg-orange-500",
        icon: "♻️ 🟠",
    },
    {id: "various", label: "Varios", color: "bg-gray-500", icon: "  ♻️ ⚫"},
];

// SVGs de la basura - Ahora 'icon' y son emojis
export const trashData = [
    {name: "Botella de Plástico", type: "plastic", icon: "🍼"},
    {name: "Lata de Refresco", type: "plastic", icon: "🥫"},
    {name: "Bolsa de Plástico", type: "plastic", icon: "🛍️"},
    {name: "Envase de Yogur", type: "plastic", icon: "🍦"},
    {name: "Periódico", type: "paper", icon: "📰"},
    {name: "Caja de Cartón", type: "paper", icon: "📦"},
    {name: "Hoja de Papel", type: "paper", icon: "📄"},
    {name: "Revista", type: "paper", icon: "📖"},
    {name: "Botella de Vidrio", type: "glass", icon: "🍾"},
    {name: "Frasco de Vidrio", type: "glass", icon: "🏺"},
    {name: "Vaso Roto", type: "glass", icon: "🍷"},
    {name: "Pila (Batería)", type: "hazardous", icon: "🔋"},
    {name: "Medicina Vencida", type: "hazardous", icon: "💊"},
    {name: "Foco", type: "hazardous", icon: "💡"},
    {name: "Aerosol", type: "hazardous", icon: "💨"},
    {name: "Cáscara de Plátano", type: "organic", icon: "🍌"},
    {name: "Resto de Manzana", type: "organic", icon: "🍎"},
    {name: "Caja de Pizza Sucia", type: "organic", icon: "🍕"},
    {name: "Cáscara de Huevo", type: "organic", icon: "🥚"},
    {name: "Pañal", type: "various", icon: "👶"},
    {name: "Juguete Roto", type: "various", icon: "🧸"},
    {name: "Ropa Vieja", type: "various", icon: "👕"},
    {name: "Tetrabrik", type: "various", icon: "🧃"},
];

// Objetos Power-Up
export const powerUpItems = [
    {
        name: "Reloj de Arena",
        type: "powerup",
        subType: "slowmo",
        icon: "⏳",
    },
    {
        name: "+1 Vida",
        type: "powerup",
        subType: "life",
        icon: "❤️",
    },
    {
        name: "x2 Puntos",
        type: "powerup",
        subType: "doublePoints",
        icon: "2️⃣",
    },
];

// Item de Peligro (Bomba)
export const dangerItem = {
    name: "¡Bomba!",
    type: "danger",
    icon: "💣",
};

// Configuración de niveles
export const levels = [
    {score: 100, speed: 90, duration: 10000, name: "Nivel 2"}, // 10s
    {score: 250, speed: 80, duration: 8000, name: "Nivel 3"}, // 8s
    {score: 500, speed: 70, duration: 7000, name: "Nivel 4"}, // 7s
    {score: 1000, speed: 60, duration: 6000, name: "¡Experto!"}, // 6s
];

// Mensajes del Bot
export const botMessages = [
    "¡Tú puedes!",
    "¡Vamos a reciclar!",
    "¡Clasifícalo bien!",
    "¡No dejes que se escape!",
    "¡El planeta te lo agradece!",
];

// Constantes de juego
export const INITIAL_LIVES = 3;
export const POWERUP_DURATION = 5000;
export const FEVER_MODE_STREAK_TARGET = 10;
export const FEVER_MODE_DURATION = 8000;
export const FEVER_MODE_SPAWN_INTERVAL = 1500;