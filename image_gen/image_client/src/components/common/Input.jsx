// src/components/common/Input.jsx
import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  touched,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error && touched
            ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        }`}
      />
      {error && touched && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
