import React from "react";

// Ícono del Cohete Mascota
export const RocketIcon = (props) => (
  <svg
    className="w-full h-full"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#F0B323"
      d="M149.5 73.2c-1.3-1.3-3.1-2.1-5-2.1-1.9 0-3.7.8-5 2.1L123 89.7c-1.3 1.3-2.1 3.1-2.1 5s.8 3.7 2.1 5l16.5 16.5c1.3 1.3 3.1 2.1 5 2.1s3.7-.8 5-2.1l16.5-16.5c1.3-1.3 2.1-3.1 2.1-5s-.8-3.7-2.1-5L149.5 73.2z"
    />
    <path
      fill="#F27127"
      d="M123 89.7L89.7 123c-1.3 1.3-3.1 2.1-5 2.1-1.9 0-3.7-.8-5-2.1L23.2 64.4c-1.3-1.3-2.1-3.1-2.1-5s.8-3.7 2.1-5l66.5-66.5c1.3-1.3 3.1-2.1 5-2.1 1.9 0 3.7.8 5 2.1l33.3 33.3-10.6 10.6-28.3-28.3-56 56 56 56 28.3-28.3 10.6 10.6z"
    />
    <path fill="#F2C84B" d="M100.3 128.1l-10.6-10.6-56-56 10.6-10.6 56 56z" />
  </svg>
);

// Ícono para la tarjeta del Huerto
export const HuertoIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.62 7.02C17.88 7.59 18 8.22 18 8.95C18 11.2 16.2 13 14 13C13.95 13 13.9 13 13.85 13C13.55 14.15 12.4 15 11 15C9.6 15 8.45 14.15 8.15 13H8.1C8.05 13 8 13 8 13C5.8 13 4 11.2 4 8.95C4 8.22 4.12 7.59 4.38 7.02C5.23 8.05 6.5 8.7 8 8.7C9.5 8.7 10.77 8.05 11.62 7.02C12.47 8.05 13.74 8.7 15.24 8.7C16.74 8.7 17.5 8.05 17.62 7.02Z"
      fill="#34d399"
    ></path>
    <path
      d="M12 14V19C12 20.1 11.1 21 10 21H14C12.9 21 12 20.1 12 19V14Z"
      fill="#6d28d9"
    ></path>
    <path
      d="M10 5C10 3.9 10.9 3 12 3C13.1 3 14 3.9 14 5V6H10V5Z"
      fill="#34d399"
    ></path>
    <circle cx="8" cy="10.5" r="1" fill="#1e293b"></circle>
    <circle cx="14" cy="10.5" r="1" fill="#1e293b"></circle>
  </svg>
);

// Ícono para la tarjeta del Supermercado
export const SupermercadoIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 1H5L7.68 14.39A2 2 0 0 0 9.67 16H18.31A2 2 0 0 0 20.28 14.64L23 6H6"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9.5" cy="20.5" r="1.5" fill="#f59e0b" />
    <circle cx="18.5" cy="20.5" r="1.5" fill="#f59e0b" />
    <text
      x="10"
      y="12"
      fontFamily="Fredoka"
      fontSize="6px"
      fill="#d97706"
      fontWeight="bold"
    >
      +
    </text>
    <text
      x="15"
      y="11"
      fontFamily="Fredoka"
      fontSize="6px"
      fill="#d97706"
      fontWeight="bold"
    >
      -
    </text>
  </svg>
);

// Ícono para la tarjeta de Ecosistemas
export const EcosistemasIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#60a5fa" />
    <path
      d="M12 2C14.521 4.36 16.33 8.04 17.21 12C16.33 15.96 14.521 19.64 12 22C9.479 19.64 7.67 15.96 6.79 12C7.67 8.04 9.479 4.36 12 2Z"
      fill="#3b82f6"
    />
    <path
      d="M12 22C16 18 16.9 14.8 17.2 12C16.9 9.2 16 6 12 2C8 6 7.1 9.2 6.8 12C7.1 14.8 8 18 12 22Z"
      stroke="#93c5fd"
      strokeWidth="1.5"
    />
    <path
      d="M15 7C15 7 13 10 13 12C13 14 15 17 15 17"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 7C9 7 11 10 11 12C11 14 9 17 9 17"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Ícono para el botón de Cerrar Sesión
export const LogoutIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
      clipRule="evenodd"
    />
  </svg>
);
