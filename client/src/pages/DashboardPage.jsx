// client/src/pages/DashboardPage.jsx

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { usuario, logout } = useAuth();
  const modulos = [
    {
      id: 1,
      nombre: "Mi Huerto Virtual",
      path: "/dashboard/huerto",
      icon: "fa-seedling",
    },
    {
      id: 2,
      nombre: "Supermercado Matemático",
      path: "/dashboard/supermercado",
      icon: "fa-cart-shopping",
      disabled: true,
    },
    {
      id: 3,
      nombre: "Constructor de Ecosistemas",
      path: "/dashboard/ecosistemas",
      icon: "fa-earth-americas",
      disabled: true,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-['Nunito',_sans-serif]">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-center">
            Laboratorio Digital
          </h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {modulos.map((modulo) => (
              <li key={modulo.id}>
                {/* 👇 3. Usamos NavLink para el resaltado automático */}
                <NavLink
                  to={modulo.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive ? "bg-cyan-600" : "hover:bg-gray-700"
                    } ${modulo.disabled ? "opacity-50 cursor-not-allowed" : ""}`
                  }
                  onClick={(e) => modulo.disabled && e.preventDefault()} // Prevenir navegación en enlaces deshabilitados
                >
                  <i
                    className={`fa-solid ${modulo.icon} w-6 text-center mr-3`}
                  ></i>
                  <span>{modulo.nombre}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <button
            onClick={logout} // 👈 4. Usamos la función logout del contexto
            className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            <i className="fa-solid fa-right-from-bracket mr-3"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white p-6 shadow-md border-b border-gray-200">
          {/* 👇 5. Personalizamos el saludo */}
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {usuario?.nombre || "Maestro"}
          </h1>
          <p className="text-gray-500 mt-1">
            Selecciona un módulo para comenzar.
          </p>
        </header>
        <div className="p-6 flex-grow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
