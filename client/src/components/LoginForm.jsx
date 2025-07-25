// client/src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/maestros/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    // Contenedor principal: ocupa toda la pantalla, fondo oscuro, y centra su contenido
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      {/* Tarjeta del formulario */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        {/* Avatar */}
        <div className="w-20 h-20 mx-auto -mt-20 mb-6 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-800">
          <i className="fa-solid fa-user text-4xl text-cyan-400"></i>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grupo de Email */}
          <div className="relative">
            <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Grupo de Contraseña */}
          <div className="relative">
            <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            className="w-full bg-cyan-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            LOGIN
          </button>
        </form>

        {/* Enlace de Registro */}
        <p className="text-center text-gray-400 mt-6">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registro"
            className="text-cyan-400 font-bold hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
