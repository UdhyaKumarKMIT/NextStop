import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5050/api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      showMessage("error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, formData);
      const { token, admin, role } = response.data;
      
      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin", JSON.stringify(admin));
      localStorage.setItem("userRole", role);
      
      showMessage("success", "Admin login successful!");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">NextStop Admin</h1>
          <p className="text-gray-600">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input w-full border-red-300 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input w-full border-red-300 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/admin/forgot-password"
              className="text-sm text-red-600 hover:text-red-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an admin account?{" "}
            <Link
              to="/admin/register"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Register here
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to User Login
          </Link>
        </div>

        {message.text && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;