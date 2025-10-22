import React from "react";

function InputWithIcon({
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="relative">
      <i
        className={`fa-solid ${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-400`}
      ></i>
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
