import React from "react";
import AdminRegisterForm from "../components/AdminRegisterForm";
import { Link } from "react-router-dom";

const AdminRegister = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-red-600 text-center mb-6">
          Create Admin Account
        </h2>
        <AdminRegisterForm />
        <Link to="/admin/login">
          <p className="text-center mt-4 text-red-600 hover:underline cursor-pointer">
            Already have an admin account? Login
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminRegister;
