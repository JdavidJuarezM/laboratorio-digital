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
  addition: `<svg class="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  subtraction: `<svg class="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  multiplication: `<svg class="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  division: `<div class="h-8 w-8 text-purple-500 flex flex-col items-center justify-center"><span class="h-2 w-2 bg-current rounded-full"></span><div class="h-1 w-6 bg-current my-1 rounded"></div><span class="h-2 w-2 bg-current rounded-full"></span></div>`,
  percentage: `<svg class="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>`,
};
