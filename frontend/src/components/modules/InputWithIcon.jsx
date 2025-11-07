import React from "react";

function InputWithIcon({
  icon, // Ahora esperamos un emoji string
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="relative">
      {/* MODIFICADO: Renderiza el emoji como texto */}
      <span
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        style={{ fontSize: "1.1rem" }} // Aseguramos un tamaño consistente
      >
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-700 text-white py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 ${
          error ? "ring-2 ring-red-500" : "focus:ring-cyan-500"
        }`}
        required
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

export default InputWithIcon;