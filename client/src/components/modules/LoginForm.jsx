// client/src/components/LoginForm.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 2. Importamos el hook de autenticación
import { login as loginService } from "../../services/authService";

function LoginForm() {
  const { login } = useAuth(); // 👈 3. Obtenemos la acción 'login' de nuestro contexto
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 4. Llamamos a nuestro servicio centralizado, no a axios directamente.
      const response = await loginService(formData.email, formData.password);

      // 5. Llamamos a la acción 'login' del contexto.
      // ¡Esta única línea se encarga de guardar el token y redirigir al usuario!
      login(response.token);
    } catch (err) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      console.error("Error en el inicio de sesión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="w-20 h-20 mx-auto -mt-20 mb-6 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-800">
          <i className="fa-solid fa-user text-4xl text-cyan-400"></i>
        </div>

        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">
              {error}
            </p>
          )}

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? "Entrando..." : "LOGIN"}
          </button>
        </form>

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
