import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import soundService from "../../services/soundService";
import ThreeJSBackground from "../common/ThreeJSBackground";
import "./LoginForm.css";

const Logo = () => (
  <div className="w-80 h-80">
    <svg id="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g id="logo-main">
        <path d="M85,15 H45 L45,45 L65,45 L65,35 L85,35 Z" fill="#F97316" />
        <path d="M45,45 L25,65 L25,85 L45,65 Z" fill="#F97316" />
      </g>
      <g id="logo-accent">
        <path d="M65,45 L45,65 L45,45 Z" fill="#FBBF24" />
      </g>
      <line
        id="logo-line"
        x1="35"
        y1="75"
        x2="60"
        y2="80"
        stroke="#FBBF24"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g id="logo-tag" transform="translate(70, 85) rotate(15)">
        <rect x="-12" y="-12" width="24" height="24" fill="#FBBF24" rx="4" />
        <circle cx="6" cy="-4" r="3" fill="#1E293B" />
      </g>
    </svg>
  </div>
);

const SuccessState = () => (
  <div className="text-center animate-slide-in-right">
    <svg
      className="w-24 h-24 mx-auto text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        className="success-checkmark"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
    <h2 className="text-3xl font-bold text-gray-800 mt-4">¡Cuenta Creada!</h2>
    <p className="text-gray-600 mt-2">Ahora serás redirigido...</p>
  </div>
);

function RegistroForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await register(formData.nombre, formData.email, formData.password);
      soundService.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      soundService.playError();
      setError(err.response?.data?.message || "Error al crear la cuenta.");
      const card = document.getElementById("card-content");
      if (card) {
        card.classList.add("shake");
        setTimeout(() => card.classList.remove("shake"), 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <ThreeJSBackground />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto items-center h-full relative">
        <div className="hidden md:flex flex-col items-center justify-center animate-slide-in-left">
          <Logo />
          <h1 className="text-5xl font-bold text-white mt-6 drop-shadow-lg">
            Laboratorio Digital
          </h1>
          <p className="text-indigo-200 text-xl mt-2">
            ¡Donde aprender es una aventura!
          </p>
        </div>

        <div
          className="flex items-center justify-center w-full animate-slide-in-right"
          style={{ animationDelay: "0.2s" }}
        >
          <main
            id="card-content"
            className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl transition-all duration-500"
          >
            {isSuccess ? (
              <SuccessState />
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                  Crear una Cuenta
                </h2>
                {error && (
                  <p className="text-center text-red-500 mb-4">{error}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group relative">
                    <input
                      type="text"
                      id="nombre"
                      onChange={handleChange}
                      value={formData.nombre}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition pt-6"
                      required
                      placeholder=" "
                    />
                    <label
                      htmlFor="nombre"
                      className="absolute left-4 top-3 text-gray-600 pointer-events-none"
                    >
                      Tu Nombre Completo
                    </label>
                  </div>
                  <div className="form-group relative">
                    <input
                      type="email"
                      id="email"
                      onChange={handleChange}
                      value={formData.email}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition pt-6"
                      required
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3 text-gray-600 pointer-events-none"
                    >
                      Tu Correo Electrónico
                    </label>
                  </div>
                  <div className="form-group relative">
                    <input
                      type="password"
                      id="password"
                      onChange={handleChange}
                      value={formData.password}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition pt-6"
                      required
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-4 top-3 text-gray-600 pointer-events-none"
                    >
                      Crea una Contraseña
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`register-button w-full text-white font-bold py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105 h-[48px] flex items-center justify-center ${
                      isLoading ? "loading" : ""
                    }`}
                  >
                    <span className="button-text">¡Crear mi Cuenta!</span>
                    <div className="spinner"></div>
                  </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-6">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/"
                    className="font-bold text-orange-600 hover:underline"
                  >
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default RegistroForm;
