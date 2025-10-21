// src/pages/AdminLogin.jsx

import { useNavigate } from "react-router-dom";
import LoginForm from "../components/AdminLoginForm"; // <-- separate form component

const AdminLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-red-600 text-center mb-6">
          Admin Login
        </h2>
        <LoginForm navigate={navigate} /> {/* pass navigate as prop */}
      </div>
    </div>
  );
};

export default AdminLogin;
