// client/src/components/layout/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import soundService from "../../services/soundService"; // Importamos el servicio

// ... (El código de los Iconos SVG se mantiene igual que antes)
const RocketIcon = () => (
  <span role="img" aria-label="Rocket">
    🚀
  </span>
);

const HuertoIcon = () => (
  <span role="img" aria-label="Plant">
    🌱
  </span>
);

const LogoutIcon = () => (
  <span role="img" aria-label="Logout">
    🚪
  </span>
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
          <div className="mascot-container w-24 h-24 mx-auto mb-4 text-6xl flex items-center justify-center">
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
              <div className="w-10 h-10 mr-4 text-3xl flex items-center justify-center">
                <HuertoIcon />
              </div>
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
          <div className="w-6 h-6 mr-3 text-2xl flex items-center justify-center">
            <LogoutIcon />
          </div>
          <span className="text-lg font-semibold">Salir</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;