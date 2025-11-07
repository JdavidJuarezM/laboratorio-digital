// client/src/components/Supermercado/constants/gameData.js

export const PRODUCTS = [
  { id: 1, name: "kilo de Manzana", price: 32.5, emoji: "🍎" },
  { id: 2, name: "kilo dePlátano", price: 22.9, emoji: "🍌" },
  { id: 3, name: "1LT de Leche", price: 34.4, emoji: "🥛" },
  { id: 4, name: "Pan blanco", price: 44.0, emoji: "🍞" },
  { id: 5, name: "Kilo de Zanahoria", price: 18.5, emoji: "🥕" },
  { id: 6, name: "kilo de Huevo", price: 47.0, emoji: "🥚" },
  { id: 7, name: "Queso", price: 193.34, emoji: "🧀" },
  { id: 8, name: "Tomate", price: 32.9, emoji: "🍅" },
  { id: 9, name: "Jugo", price: 19.0, emoji: "🧃" },
  { id: 10, name: "Galletas", price: 22.0, emoji: "🍪" },
  { id: 11, name: "Yogur", price: 57.0, emoji: "🍦" },
  { id: 12, name: "Jabón", price: 17.0, emoji: "🧼" },
  { id: 13, name: "Cereal", price: 62.0, emoji: "🥣" },
  { id: 14, name: "Fresa", price: 60.0, emoji: "🍓" },
  { id: 15, name: "Uva", price: 70.0, emoji: "🍇" },
  { id: 16, name: "Pizza", price: 99.0, emoji: "🍕" },
  { id: 17, name: "Pollo", price: 120.0, emoji: "🍗" },
  { id: 18, name: "Pescado", price: 115.0, emoji: "🐟" },
  { id: 19, name: "Café", price: 49.0, emoji: "☕" },
  { id: 20, name: "Brócoli", price: 15.0, emoji: "🥦" },
  { id: 21, name: "Helado", price: 22.0, emoji: "🍨" },
  { id: 22, name: "Agua", price: 15.0, emoji: "💧" },
  { id: 23, name: "Chocolate", price: 22.0, emoji: "🍫" },
  { id: 24, name: "Aguacate", price: 33.5, emoji: "🥑" },
];

export const DIFFICULTY_SETTINGS = {
  easy: { items: [2, 3], questions: ["multiplication", "addition"] },
  normal: {
    items: [3, 5],
    questions: ["multiplication", "addition", "subtraction"],
  },
  hard: {
    items: [4, 7],
    questions: [
      "multiplication",
      "addition",
      "subtraction",
      "division",
      "percentage",
    ],
  },
  extreme: {
    items: [5, 8],
    questions: [
      "multiplication",
      "addition",
      "subtraction",
      "division",
      "percentage",
    ],
  },
};

export const ICONS = {
  addition: "➕",
  subtraction: "➖",
  multiplication: "✖️",
  division: "➗",
  percentage: "٪",
};