import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Website Name */}
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        NextStop
      </h1>

      {/* Profile Button */}
      <button
        onClick={() => navigate("/profile")}
        className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Profile
      </button>
    </nav>
  );
};

export default Navbar;
