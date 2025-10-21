import React from "react";

const Navbar = ({ admin, onLogout }) => {
  return (
    <nav className="bg-red-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div>
        <h1 className="text-xl font-bold tracking-wide">NextStop Admin Dashboard</h1>
        <p className="text-sm text-red-200">Welcome, {admin.username} ({admin.role})</p>
      </div>
      <button 
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-md transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;