// src/components/InputField.jsx
import React from "react";

const InputField = ({ type, placeholder, value, onChange, name }) => {
  return (
    <input
      type={type}
      name={name}   // ✅ add this
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 mb-4 border border-red-400 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
    />
  );
};

export default InputField;
