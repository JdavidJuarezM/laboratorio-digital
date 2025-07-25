// client/src/pages/DashboardPage.jsx
import React from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
      path: "#",
      icon: "fa-cart-shopping",
    },
    {
      id: 3,
      nombre: "Constructor de Ecosistemas",
      path: "#",
      icon: "fa-earth-americas",
    },
  ];

  return (
    // Contenedor principal del Dashboard
    <div className="flex h-screen bg-gray-100 font-['Nunito',_sans-serif]">
      {/* Barra lateral (Sidebar) */}
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
                <Link
                  to={modulo.path}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <i
                    className={`fa-solid ${modulo.icon} w-6 text-center mr-3`}
                  ></i>
                  <span>{modulo.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            <i className="fa-solid fa-right-from-bracket mr-3"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área de contenido principal */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white p-6 shadow-md border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
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
