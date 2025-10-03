import React from "react";

const Button = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      {children}
    </button>
  );
};

export default Button;
