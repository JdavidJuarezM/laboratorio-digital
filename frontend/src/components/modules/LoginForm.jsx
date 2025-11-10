// frontend/src/components/modules/LoginForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import soundService from "../../services/soundService";
import ThreeJSBackground from "../common/ThreeJSBackground";
import "./LoginForm.css";

// (Recuerda configurar las fuentes 'Nunito' y 'Fredoka'
// en tu 'tailwind.config.js' como hablamos)

const SuccessState = () => (
  <div
    className="text-center animate-slide-in-right"
    role="status"
    aria-live="polite"
  >
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
    <h2 className="mt-4 text-3xl font-bold text-gray-800 font-heading">¡Bienvenido!</h2>
    <p className="mt-2 text-gray-600">Redirigiendo a tus aventuras...</p>
  </div>
);

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (isShaking) setIsShaking(false);

    try {
      // await login(formData.email, formData.password);
      if (formData.password !== "1234") {
        throw new Error("Contraseña de prueba es '1234'");
      }
      soundService.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      soundService.playError();
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Clases del botón (TEMA MORADO)
  const buttonClasses = [
    "login-button",
    "bg-purple-700", // Morado
    "hover:bg-purple-800",
    "active:scale-[0.98]",
    "flex", "h-[48px]", "w-full", "items-center", "justify-center", "rounded-lg",
    "py-3", "font-bold", "text-white", "shadow-lg", "transition", "duration-300",
    isLoading ? "loading" : "",
  ].join(" ").trim();

  return (
    <div className="antialiased min-h-screen font-sans">
      <ThreeJSBackground />

      <div className="main-container relative min-h-screen z-10">
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 h-screen">

            {/* --- Columna Izquierda (con Logo y Texto nuevo) --- */}
            <div className="relative hidden md:flex flex-col justify-center items-center p-12 bg-[#c4bfb7] animate-slide-in-left overflow-hidden">
              {/* Círculos decorativos (como en tu imagen) */}
              <div className="absolute w-64 h-64 -top-20 -left-20 bg-purple-200 rounded-full opacity-50"></div>
              <div className="absolute w-48 h-48 -bottom-24 right-10 bg-purple-200 rounded-full opacity-50"></div>
              <div className="absolute w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"></div>{/* Círculo blanco arriba del logo */}
              <div className="absolute w-32 h-32 bottom-10 right-20 bg-purple-100 rounded-full opacity-60"></div> {/* Círculo abajo derecha */}


              {/* Contenido centrado */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full max-w-md mx-auto">

                {/* Logo de la escuela */}
                <img
                  src="/logoEscuela.png" // Asumiendo que esta es la ruta de tu logo
                  alt="Logo de la Escuela Primaria Emiliano Zapata"
                  className="w-55 h-55 mx-auto mb-2 rounded-full" // Tamaño grande, centrado
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/192x192/ffffff/999999?text=LOGO';
                    e.target.onerror = null;
                  }}
                />
                </div>

                <div className="relative z-10 items-center justify-center text-center h-full max-w-md mx-auto">
                    {/* Texto "Laboratorio Digital" */}
                    <h2 className="text-6xl font-bold text-gray-800 mb-2">
                        Laboratorio Digital
                    </h2>
                    {/* Texto descriptivo */}
                    <p className="text-gray-600 text-lg leading-relaxed px-4">
                        Un espacio donde los estudiantes de la Escuela Primaria <br /> Emiliano Zapata pueden aprender jugando.
                    </p>
                </div>
            </div>

            {/* --- Columna Derecha (Formulario Transparente) --- */}
            <div className="relative flex flex-col justify-center p-8 md:p-12 animate-slide-in-right bg-white/30 backdrop-blur-sm">
              <main
                id="dynamic-content"
                className={`w-full max-w-md mx-auto ${
                  isShaking ? "shake" : ""
                }`}
              >
                {isSuccess ? (
                  <SuccessState />
                ) : (
                  <div>
                    <h2 className="mb-2 text-center text-3xl font-bold text-gray-200 font-heading">
                      Iniciar Sesión
                    </h2>
                    <p className="text-center text-gray-100 mb-6">
                      en tu cuenta del Laboratorio Digital
                    </p>

                    {error && (
                      <div
                        role="alert"
                        aria-live="assertive"
                        className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700"
                      >
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          onChange={handleChange}
                          value={formData.email}
                          className="peer mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="tu@correo.com"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Contraseña Única
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          onChange={handleChange}
                          value={formData.password}
                          className="peer mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Tu contraseña"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-gray-900"
                          >
                            Recordarme
                          </label>
                        </div>
                        <a
                          href="#"
                          className="font-medium text-purple-300 hover:text-purple-300 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={buttonClasses}
                      >
                        <span className="button-text">¡Entrar!</span>
                        <div className="spinner"></div>
                      </button>
                    </form>
                  </div>
                )}
              </main>

              {!isSuccess && (
                <p className="mt-8 text-center text-sm text-gray-200">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    to="/registro"
                    className="font-bold text-purple-300 hover:text-purple-500 hover:underline"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;