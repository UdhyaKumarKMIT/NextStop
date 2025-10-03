import LoginForm from "../components/LoginForm";
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
import React from "react";

const Login = () => {
  const navigate = useNavigate(); // <-- define navigate inside the component

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-red-600 text-center mb-6">Login</h2>
        <LoginForm />

        {/* Forgot Password Link */}
        <p
          className="text-center mt-4 text-red-600 hover:underline cursor-pointer"
          onClick={() => navigate("/reset-password")} // <-- navigate on click
        >
          Forgot Password?
        </p>

        {/* Register Link */}
        <Link to="/register">
          <p className="text-center mt-4 text-red-600 hover:underline cursor-pointer">
            Don't have an account?
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
