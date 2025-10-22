// client/src/components/layout/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import soundService from "../../services/soundService"; // Importamos el servicio

// ... (El código de los Iconos SVG se mantiene igual que antes)
const RocketIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
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

const HuertoIcon = () => (
  <svg
    className="w-10 h-10 mr-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.62 7.02C17.88 7.59 18 8.22 18 8.95C18 11.2 16.2 13 14 13C13.95 13 13.9 13 13.85 13C13.55 14.15 12.4 15 11 15C9.6 15 8.45 14.15 8.15 13H8.1C8.05 13 8 13 8 13C5.8 13 4 11.2 4 8.95C4 8.22 4.12 7.59 4.38 7.02C5.23 8.05 6.5 8.7 8 8.7C9.5 8.7 10.77 8.05 11.62 7.02C12.47 8.05 13.74 8.7 15.24 8.7C16.74 8.7 17.5 8.05 17.62 7.02Z"
      fill="#a7f3d0"
    ></path>
    <path
      d="M12 14V19C12 20.1 11.1 21 10 21H14C12.9 21 12 20.1 12 19V14Z"
      fill="#6d28d9"
    ></path>
    <path
      d="M10 5C10 3.9 10.9 3 12 3C13.1 3 14 3.9 14 5V6H10V5Z"
      fill="#a7f3d0"
    ></path>
    <circle cx="8" cy="10.5" r="1" fill="#1e293b"></circle>
    <circle cx="14" cy="10.5" r="1" fill="#1e293b"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-6 h-6 mr-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    ></path>
  </svg>
);

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    soundService.playClick();
    navigate("/");
  };

  return (
    <nav className="w-full md:w-80 bg-indigo-600/80 backdrop-blur-xl text-white p-6 shadow-2xl flex flex-col justify-between md:rounded-r-3xl border-r-4 border-indigo-400">
      <div>
        <div className="text-center mb-10">
          <div className="mascot-container w-24 h-24 mx-auto mb-4">
            <RocketIcon />
          </div>
          <h1 className="text-4xl font-bold tracking-wider text-shadow">
            Lab Digital
          </h1>
          <p className="text-indigo-200 text-lg">¡A Jugar!</p>
        </div>

        <div className="bg-indigo-500/50 p-3 rounded-xl mb-8 text-center">
          <p className="text-sm text-indigo-200">¡Hola de nuevo!</p>
          <p className="font-bold text-xl text-white truncate">Explorador</p>
        </div>

        <ul className="space-y-4">
          <li>
            <NavLink
              to="/dashboard/huerto"
              className="menu-item flex items-center p-4 rounded-xl shadow-lg"
              onMouseEnter={soundService.playHover} // Directamente llamamos al servicio
              onClick={soundService.playClick}
            >
              <HuertoIcon />
              <span className="text-lg font-semibold">Mi Huerto Virtual</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          onMouseEnter={soundService.playHover}
          className="w-full flex items-center justify-center p-4 rounded-xl shadow-lg bg-red-500 hover:bg-red-600 transition-colors duration-200"
        >
          <LogoutIcon />
          <span className="text-lg font-semibold">Salir</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
