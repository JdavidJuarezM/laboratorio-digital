// frontend/src/components/Reciclaje/constants.js
import {
    IconoReciclaje,
    BotelladePlastico
} from './BoteIconos.jsx';

// Tipos de contenedores
export const binData = [
  { id: 'plastic', label: 'Plásticos y Latas', color: 'bg-yellow-400', icon: IconoReciclaje },
  { id: 'paper', label: 'Papeles y Cartones', icon: IconoReciclaje, color: 'bg-blue-500' },
  { id: 'glass', label: 'Vidrio', color: 'bg-green-600', icon: IconoReciclaje },
  { id: 'hazardous', label: 'Residuos Peligrosos', color: 'bg-red-600', icon: IconoReciclaje },
  { id: 'organic', label: 'Orgánicos', color: 'bg-orange-500', icon: IconoReciclaje },
  { id: 'various', label: 'Varios', color: 'bg-gray-500', icon: IconoReciclaje }
];


// SVGs de la basura
export const trashData = [
  { name: 'Botella de Plástico', type: 'plastic', svg: BotelladePlastico },
  { name: 'Lata de Refresco', type: 'plastic', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-metal' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:#d1d5db;stop-opacity:1' /><stop offset='50%' style='stop-color:#9ca3af;stop-opacity:1' /><stop offset='100%' style='stop-color:#d1d5db;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-metal)' d='M5 3H19V4H5V3M19 21H5V6H19V21M7 8H17V19H7V8Z' /><path fill='#ef4444' d='M7 9H17V18H7V9Z' /><path fill='rgba(255,255,255,0.7)' d='M8 10H10V17H8V10Z' /></svg>` },
  { name: 'Bolsa de Plástico', type: 'plastic', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-bag' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#f3f4f6;stop-opacity:1' /><stop offset='100%' style='stop-color:#d1d5db;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-bag)' d='M16 5H14.4C14.4 3.9 14 3 13.2 2.2C12.4 1.4 11.4 1 10.3 1C9.2 1 8.2 1.4 7.4 2.2C6.6 3 6.2 3.9 6.2 5H4C3.4 5 3 5.4 3 6V20C3 20.6 3.4 21 4 21H18C18.6 21 19 20.6 19 20V6C19 5.4 18.6 5 16 5M10.3 3C10.7 3 11.1 3.1 11.4 3.4C11.7 3.7 11.8 4.1 11.8 4.5H8.8C8.8 4.1 8.9 3.7 9.2 3.4C9.5 3.1 9.9 3 10.3 3M17 19H5V7H6.2V9H8.2V7H14.4V9H16.4V7H17V19Z' /></svg>` },
  { name: 'Envase de Yogur', type: 'plastic', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-yogurt' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#f1f5f9;stop-opacity:1' /><stop offset='100%' style='stop-color:#e2e8f0;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-yogurt)' d='M18,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V4C20,2.9 19.1,2 18,2M6,4H18V6H6V4M18,20H6V8H18V20Z' /><path fill='#3b82f6' d='M8 10H16V12H8z' /></svg>` },
  { name: 'Periódico', type: 'paper', svg: `<svg class="text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20,8V6H4V8H20M20,10V12H13V10H20M20,14V16H13V14H20M11,10H4V18H11V10M18,2H6V4H18V2Z" /></svg>` },
  { name: 'Caja de Cartón', type: 'paper', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-box' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#d97706;stop-opacity:1' /><stop offset='100%' style='stop-color:#b45309;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-box)' d='M3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3H5C3.9,3 3,3.9 3,5M5,5H19V19H5V5Z' /><path fill='rgba(0,0,0,0.2)' d='M5 5 H19 V7 H5 Z M 12 7 L 12 19 H 13 V 7 Z' /></svg>` },
  { name: 'Hoja de Papel', type: 'paper', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-paper' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#f8fafc;stop-opacity:1' /><stop offset='100%' style='stop-color:#e2e8f0;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-paper)' d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20Z' /><path fill='rgba(0,0,0,0.1)' d='M13 4 V9 H18 Z' /></svg>` },
  { name: 'Revista', type: 'paper', svg: `<svg class="text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16,2H8C6.9,2 6,2.9 6,4V20C6,21.1 6.9,22 8,22H16C17.1,22 18,21.1 18,20V4C18,2.9 17.1,2 16,2M8,4H16V20H8V4M10,6V8H14V6H10M10,10V12H14V10H10M10,14V16H12V14H10Z" /></svg>` },
  { name: 'Botella de Vidrio', type: 'glass', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-glass' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:#16a34a;stop-opacity:1' /><stop offset='50%' style='stop-color:#10b981;stop-opacity:1' /><stop offset='100%' style='stop-color:#16a34a;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-glass)' d='M15,2H9C8.4,2 8,2.4 8,3V4.3C7.4,4.9 7,5.6 7,6.5V21C7,21.6 7.4,22 8,22H16C16.6,22 17,21.6 17,21V6.5C17,5.6 16.6,4.9 16,4.3V3C16,2.4 15.6,2 15,2M9,4H15V4.3C14.4,4.9 14,5.6 14,6.5V11H10V6.5C10,5.6 9.6,4.9 9,4.3V4M15,20H9V12H15V20Z' /><path fill='rgba(255,255,255,0.4)' d='M10 13H11V19H10z' /></svg>` },
  { name: 'Frasco de Vidrio', type: 'glass', svg: `<svg class="text-green-300" fill="currentColor" viewBox="0 0 24 24"><path d="M16,2H8C7.4,2 7,2.4 7,3V5H17V3C17,2.4 16.6,2 16,2M5,7V21C5,21.6 5.4,22 6,22H18C18.6,22 19,21.6 19,21V7H5M7,9H17V19H7V9Z" /></svg>` },
  { name: 'Vaso Roto', type: 'glass', svg: `<svg class="text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M8,4L4,22H20L16,4H8M6.2,20L9.2,6H14.8L17.8,20H6.2M11,10L9.8,12.4L11,15L12,13L13,15L14.2,12.4L13,10H11Z" /></svg>` },
  { name: 'Pila (Batería)', type: 'hazardous', svg: `<svg class="text-gray-700" fill="currentColor" viewBox="0 0 24 24"><path d="M17,6H7V4H17M17,20H7V7H17V20M15,9H9V11H15V9Z" /></svg>` },
  { name: 'Medicina Vencida', type: 'hazardous', svg: `<svg class="text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19,6H16V3H8V6H5C3.9,6 3,6.9 3,8V20C3,21.1 3.9,22 5,22H19C20.1,22 21,21.1 21,20V8C21,6.9 20.1,6 19,6M10,3H14V6H10V3M19,20H5V8H19V20M13,10H11V13H8V15H11V18H13V15H16V13H13V10Z" /></svg>` },
  { name: 'Foco', type: 'hazardous', svg: `<svg class="text-yellow-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z" /></svg>` },
  { name: 'Aerosol', type: 'hazardous', svg: `<svg class="text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7,2H17C18.1,2 19,2.9 19,4V20C19,21.1 18.1,22 17,22H7C5.9,22 5,21.1 5,20V4C5,2.9 5.9,2 7,2M7,4V6H17V4H7M7,8H17V20H7V8M9,10V12H15V10H9Z" /></svg>` },
  { name: 'Cáscara de Plátano', type: 'organic', svg: `<svg class="text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.3,18C15.8,20.4 12.8,22 9.5,22C5.4,22 2,18.6 2,14.5C2,10.4 5.4,7 9.5,7C10.7,7 11.9,7.3 12.9,7.8L11,12.3L12,16.8L17.3,18M13.4,6.8C12.4,6.3 11,6 9.5,6C4.8,6 1,9.8 1,14.5C1,19.2 4.8,23 9.5,23C13.2,23 16.5,21.1 18.1,18.2L13.1,16.3L12,11.7L14.3,6.5L13.4,6.8M23,13.5C23,12.7 22.6,12.1 22,11.8V10.2C22.6,9.9 23,9.3 23,8.5C23,7.7 22.3,7 21.5,7H20V6H18V7H16.5C15.7,7 15,7.7 15,8.5C15,9.3 15.4,9.9 16,10.2V11.8C15.4,12.1 15,12.7 15,13.5C15,14.3 15.7,15 16.5,15H18V16H20V15H21.5C22.3,15 23,14.3 23,13.5Z" /></svg>` },
  { name: 'Resto de Manzana', type: 'organic', svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-apple' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#ef4444;stop-opacity:1' /><stop offset='100%' style='stop-color:#b91c1c;stop-opacity:1' /></linearGradient></defs><path fill='#a16207' d='M12,4C11.4,4 11,3.6 11,3V2H13V3C13,3.6 12.6,4 12,4Z' /><path fill='url(#grad-apple)' d='M19.3,13.4C18.1,13.8 17.1,14.9 16.7,16.2C16.2,17.7 16.5,19.3 17.3,20.6C16.8,21.5 15.9,22 15,22C14.1,22 13.3,21.6 12.7,21C12,20.4 11.5,19.5 11.4,18.6C10,18.1 9,17 8.6,15.7C8.1,14.2 8.4,12.6 9.2,11.3C9.8,10.4 10.7,10 11.7,10C12.6,10 13.4,10.3 14,10.9C14.7,11.5 15.2,12.4 15.3,13.3C16.7,13.8 17.7,14.9 18.1,16.2C18.6,17.7 18.3,19.3 17.5,20.6C18.4,19.3 18.1,17.7 17.6,16.2C17.2,14.9 16.1,13.8 14.8,13.4C15.4,12.6 15.9,11.7 16,10.7C17.3,11.1 18.5,12.1 19.3,13.4Z' /></svg>` },
  { name: 'Caja de Pizza Sucia', type: 'organic', svg: `<svg class="text-yellow-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L2,12L12,21L22,12L12,3M12,19.3L4.7,12L12,4.7L19.3,12L12,19.3M11.5,11.8C10.8,11.8 10.3,11.2 10.3,10.5C10.3,9.8 10.8,9.2 11.5,9.2C12.2,9.2 12.8,9.8 12.8,10.5C12.8,11.2 12.2,11.8 11.5,11.8M15.5,14.8C14.8,14.8 14.3,14.2 14.3,13.5C14.3,12.8 14.8,12.2 15.5,12.2C16.2,12.2 16.8,12.8 16.8,13.5C16.8,14.2 16.2,14.8 15.5,14.8M8.5,14.8C7.8,14.8 7.3,14.2 7.3,13.5C7.3,12.8 7.8,12.2 8.5,12.2C9.2,12.2 9.8,12.8 9.8,13.5C9.8,14.2 9.2,14.8 8.5,14.8Z" /></svg>` },
  { name: 'Cáscara de Huevo', type: 'organic', svg: `<svg class="text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2C6.5,2 2,6.5 2,12C2,17.5 6.5,22 12,22C17.5,22 22,17.5 22,12C22,6.5 17.5,2 12,2M12,4C16.4,4 20,7.6 20,12C20,16.4 16.4,20 12,20C7.6,20 4,16.4 4,12C4,7.6 7.6,4 12,4M10.8,6.1L8.7,9.3L9.5,10.2L11.2,7.1L10.8,6.1M13.2,6.1L12.8,7.1L14.5,10.2L15.3,9.3L13.2,6.1M7.9,11.2L6.1,12.8L7.1,13.2L10.2,11.5L7.9,11.2M13.8,11.5L16.9,13.2L17.9,12.8L16.1,11.2L13.8,11.5M11.5,13L9.8,16.1L10.2,17.1L12.5,13.8L11.5,13M12.5,13.8L13.8,17.1L14.2,16.1L12.5,13Z" /></svg>` },
  { name: 'Pañal', type: 'various', svg: `<svg class="text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5,18L18,17L15.5,18L13,17L10.5,18L8,17L5.5,18L3,17L4.5,14L3,11L5.5,12L8,11L10.5,12L13,11L15.5,12L18,11L20.5,12L22,14L20.5,18M11,6C11,3.8 12.8,2 15,2C17.2,2 19,3.8 19,6C19,8.2 17.2,10 15,10C12.8,10 11,8.2 11,6M15,8C16.1,8 17,7.1 17,6C17,4.9 16.1,4 15,4C13.9,4 13,4.9 13,6C13,7.1 13.9,8 15,8Z" /></svg>` },
  { name: 'Juguete Roto', type: 'various', svg: `<svg class="text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6M16,14.1C16,14.7 15.6,15.2 15,15.2L14.9,17.1C14.9,18.1 14.1,19 13.1,19H10.9C9.9,19 9.1,18.1 9.1,17.1L9,15.2C8.4,15.2 8,14.7 8,14.1V13H16V14.1M21.7,11.3C20.8,10.8 19.8,11.2 19.3,12C18.8,12.8 19.2,13.8 20,14.3C20.8,14.8 21.8,14.4 22.3,13.7C22.8,12.8 22.4,11.8 21.7,11.3M4,14.3C4.8,14.8 5.8,14.4 6.3,13.7C6.8,12.8 6.4,11.8 5.7,11.3C4.8,10.8 3.8,11.2 3.3,12C2.8,12.8 3.2,13.8 4,14.3Z" /></svg>` },
  { name: 'Ropa Vieja', type: 'various', svg: `<svg class="text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9.6,7.4L8.2,6L4,10V20H20V10L15.8,6L14.4,7.4L12,5L9.6,7.4M6,10.5L8.8,8L10.2,9.4L12,7.6L13.8,9.4L15.2,8L18,10.5V18H6V10.5Z" /></svg>` },
  { name: 'Tetrabrik', type: 'various', svg: `<svg class="text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19,21H5C3.9,21 3,20.1 3,19V5C3,3.9 3.9,3 5,3H19C20.1,3 21,3.9 21,5V19C21,20.1 20.1,21 19,21M5,5V19H19V5H5M7,7H17V9H7V7M7,11H17V13H7V11Z" /></svg>` }
];

// Objetos Power-Up
export const powerUpItems = [
  {
    name: 'Reloj de Arena',
    type: 'powerup',
    subType: 'slowmo',
    svg: `<svg class="text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2V8H6V8L10 12L6 16V16H6V22H18V16H18V16L14 12L18 8V8H18V2H6M16 16.5V20H8V16.5L12 12.5L16 16.5M12 11.5L8 7.5V4H16V7.5L12 11.5Z" /></svg>`
  },
  {
    name: '+1 Vida',
    type: 'powerup',
    subType: 'life',
    svg: `<svg class="text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"/></svg>`
  },
  {
    name: 'x2 Puntos',
    type: 'powerup',
    subType: 'doublePoints',
    svg: `<svg class="text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3H5V5H3V3M7 3H9V5H7V3M11 3H13V5H11V3M15 3H17V5H15V3M19 3H21V5H19V3M3 7H5V9H3V7M19 7H21V9H19V7M3 11H5V13H3V11M21 11H19V13H21V11M3 15H5V17H3V15M19 15H21V17H19V15M3 19H5V21H3V19M7 19H9V21H7V19M11 19H13V21H11V19M15 19H17V21H15V19M19 19H21V21H19V19M10.8 10.7L12.7 7H15.5V9H13.5L11.8 11.7L13.5 14.4H15.5V16H12.7L10.8 13.3L8.9 16H6.1V14.4H8.1L9.8 11.7L8.1 9H6.1V7H8.9L10.8 10.7Z" /></svg>`
  }
];

// Item de Peligro (Bomba)
export const dangerItem = {
  name: '¡Bomba!',
  type: 'danger',
  svg: `<svg viewBox='0 0 24 24'><defs><linearGradient id='grad-bomb' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:#4b5563;stop-opacity:1' /><stop offset='100%' style='stop-color:#1f2937;stop-opacity:1' /></linearGradient><linearGradient id='grad-fuse' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:#f59e0b;stop-opacity:1' /><stop offset='100%' style='stop-color:#ef4444;stop-opacity:1' /></linearGradient></defs><path fill='url(#grad-bomb)' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/><path fill='rgba(255,255,255,0.3)' d='M12 4c-4.41 0-8 3.59-8 8 0 .28.02.56.05.83C4.5 7.1 7.9 4 12 4z'/><path fill='#94a3b8' d='M11 1h2v4h-2z'/><path fill='url(#grad-fuse)' d='M12 4.5C12.5 4.5 13 4 13 3.5V2C13 1.5 13.5 1 14 1s1 .5 1 1v1.5c0 .5.5 1 1 1s1-.5 1-1V2c0-.5.5-1 1-1s1 .5 1 1V3.5C19 4 19.5 4.5 20 4.5S20.5 4 20.5 3.5V3c0-1-1-2-2-2h-1c-1 0-2 .5-2 1.5V3c0 .5-.5 1-1 1s-1-.5-1-1V1.5C13.5.5 12.5 0 11.5 0h-1C9.5 0 8.5.5 8.5 1.5V3c0 .5-.5 1-1 1s-1-.5-1-1V1.5C6.5.5 5.5 0 4.5 0h-1C2.5 0 1.5.5 1.5 1.5V3c0 .5.5 1 1 1s1-.5 1-1V1.5C4.5.5 5.5 0 6.5 0S7.5.5 7.5 1.5V3c0 .5.5 1 1 1s1-.5 1-1V1.5C10.5.5 11.5 1 12 1c.5 0 1 .5 1 1v1.5c0 .5.5 1 1 1z' transform='translate(1.5, 0.5) scale(0.6)'/></svg>`
};

// Configuración de niveles
export const levels = [
  { score: 100, speed: 90, duration: 10000, name: "Nivel 2" }, // 10s
  { score: 250, speed: 80, duration: 8000, name: "Nivel 3" }, // 8s
  { score: 500, speed: 70, duration: 7000, name: "Nivel 4" }, // 7s
  { score: 1000, speed: 60, duration: 6000, name: "¡Experto!" }  // 6s
];

// Mensajes del Bot
export const botMessages = [
  "¡Tú puedes!",
  "¡Vamos a reciclar!",
  "¡Clasifícalo bien!",
  "¡No dejes que se escape!",
  "¡El planeta te lo agradece!"
];

// Constantes de juego
export const INITIAL_LIVES = 3;
export const POWERUP_DURATION = 5000;
export const FEVER_MODE_STREAK_TARGET = 10;
export const FEVER_MODE_DURATION = 8000;
export const FEVER_MODE_SPAWN_INTERVAL = 1500;
