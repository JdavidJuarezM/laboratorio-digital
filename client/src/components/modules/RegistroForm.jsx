import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient"; // 1. Importar la instancia de Axios
import InputWithIcon from "./InputWithIcon"; // 2. Importar el nuevo componente de input

function RegistroForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Función de validación
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.email) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del email es inválido.";
    }
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiMessage({ type: "", text: "" });

    try {
      // 4. Usar la instancia de apiClient
      const response = await apiClient.post("/maestros/registro", formData);
      setApiMessage({ type: "success", text: response.data.message });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Hubo un error al registrarse.";
      setApiMessage({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="w-20 h-20 mx-auto -mt-20 mb-4 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-800">
          <i className="fa-solid fa-user-plus text-4xl text-cyan-400"></i>
        </div>

        {/* 5. Mensajes de la API (éxito o error) */}
        {apiMessage.text && (
          <div
            className={`p-3 rounded-lg text-center mb-4 ${
              apiMessage.type === "success"
                ? "bg-green-800 text-green-200"
                : "bg-red-800 text-red-200"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 6. Usar el componente InputWithIcon */}
          <InputWithIcon
            icon="fa-user"
            type="text"
            name="nombre"
            placeholder="Nombre Completo"
            value={formData.nombre}
            onChange={handleInputChange}
            error={errors.nombre}
          />
          <InputWithIcon
            icon="fa-envelope"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <InputWithIcon
            icon="fa-lock"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "REGISTRARSE"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/" className="text-cyan-400 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegistroForm;
