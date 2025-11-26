// client/src/components/Supermercado/constants/gameData.js

export const PRODUCTS = [
  // Frutas y Verduras
  { id: 1, name: "Kilo de Manzana", price: 32.5, emoji: "🍎" },
  { id: 2, name: "Kilo de Plátano", price: 22.9, emoji: "🍌" },
  { id: 5, name: "Kilo de Zanahoria", price: 18.5, emoji: "🥕" },
  { id: 8, name: "Tomate", price: 32.9, emoji: "🍅" },
  { id: 14, name: "Fresa", price: 60.0, emoji: "🍓" },
  { id: 15, name: "Uva", price: 70.0, emoji: "🍇" },
  { id: 20, name: "Brócoli", price: 15.0, emoji: "🥦" },
  { id: 24, name: "Aguacate", price: 33.5, emoji: "🥑" },
  { id: 25, name: "Naranja", price: 19.9, emoji: "🍊" },
  { id: 26, name: "Papa", price: 24.0, emoji: "🥔" },
  { id: 27, name: "Cebolla", price: 18.0, emoji: "🧅" },
  { id: 28, name: "Sandía", price: 15.0, emoji: "🍉" },
  { id: 29, name: "Piña", price: 28.0, emoji: "🍍" },
  { id: 30, name: "Limón", price: 38.0, emoji: "🍋" },
  { id: 31, name: "Elote", price: 8.5, emoji: "🌽" },
  { id: 32, name: "Chile", price: 4.0, emoji: "🌶️" },
  { id: 33, name: "Cereza", price: 85.0, emoji: "🍒" },
  { id: 34, name: "Coco", price: 45.0, emoji: "🥥" },

  // Lácteos y Huevo
  { id: 3, name: "Leche 1L", price: 34.4, emoji: "🥛" },
  { id: 6, name: "Kilo de Huevo", price: 47.0, emoji: "🥚" },
  { id: 7, name: "Queso", price: 193.34, emoji: "🧀" },
  { id: 11, name: "Yogur", price: 17.0, emoji: "🍦" },
  { id: 35, name: "Mantequilla", price: 22.5, emoji: "🧈" },

  // Panadería y Dulces
  { id: 4, name: "Pan Blanco", price: 44.0, emoji: "🍞" },
  { id: 10, name: "Galletas", price: 22.0, emoji: "🍪" },
  { id: 21, name: "Helado", price: 55.0, emoji: "🍨" },
  { id: 23, name: "Chocolate", price: 22.0, emoji: "🍫" },
  { id: 36, name: "Dona", price: 12.0, emoji: "🍩" },
  { id: 37, name: "Pastel", price: 250.0, emoji: "🎂" },
  { id: 38, name: "Miel", price: 80.0, emoji: "🍯" },
  { id: 39, name: "Paleta", price: 5.0, emoji: "🍭" },
  { id: 40, name: "Croissant", price: 18.0, emoji: "🥐" },

  // Bebidas
  { id: 9, name: "Jugo", price: 19.0, emoji: "🧃" },
  { id: 19, name: "Café", price: 49.0, emoji: "☕" },
  { id: 22, name: "Agua", price: 15.0, emoji: "💧" },
  { id: 41, name: "Refresco", price: 22.0, emoji: "🥤" },
  { id: 42, name: "Té", price: 12.0, emoji: "🍵" },

  // Carnes y Comida
  { id: 16, name: "Pizza", price: 99.0, emoji: "🍕" },
  { id: 17, name: "Pollo", price: 120.0, emoji: "🍗" },
  { id: 18, name: "Pescado", price: 115.0, emoji: "🐟" },
  { id: 43, name: "Hamburguesa", price: 65.0, emoji: "🍔" },
  { id: 44, name: "Hot Dog", price: 35.0, emoji: "🌭" },
  { id: 45, name: "Taco", price: 15.0, emoji: "🌮" },
  { id: 46, name: "Carne", price: 160.0, emoji: "🥩" },
  { id: 47, name: "Camarón", price: 220.0, emoji: "🍤" },
  { id: 48, name: "Tocino", price: 60.0, emoji: "🥓" },

  // Despensa y Limpieza
  { id: 12, name: "Jabón", price: 17.0, emoji: "🧼" },
  { id: 13, name: "Cereal", price: 62.0, emoji: "🥣" },
  { id: 49, name: "Arroz", price: 24.5, emoji: "🍚" },
  { id: 50, name: "Papel Higiénico", price: 45.0, emoji: "🧻" },
];

// client/src/components/Supermercado/constants/gameData.js

export const DIFFICULTY_SETTINGS = {
    easy: {
        items: [3, 5],           // De 3 a 5 productos diferentes
        quantityRange: [2, 8],   // De 3 a 8 piezas por producto
        questions: ["addition", "multiplication"] // Operaciones simples
    },
    normal: {
        items: [5, 8],           // De 5 a 8 productos
        quantityRange: [2, 11],  // De 5 a 11 piezas
        questions: ["multiplication", "addition", "subtraction"]
    },
    hard: {
        items: [8, 15],          // De 8 a 15 productos
        quantityRange: [2, 13],  // De 9 a 13 piezas
        questions: ["multiplication", "subtraction", "percentage"]
    },
    extreme: {
        items: [16, 21],         // De 16 a 21 productos (¡El carrito estará lleno!)
        quantityRange: [2, 46], // De 24 a 46 piezas (Cálculos grandes)
        questions: ["multiplication", "percentage", "division"]
    },
};

export const ICONS = {
    addition: "➕",
    subtraction: "➖",
    multiplication: "✖️",
    division: "➗",
    percentage: "٪",
};