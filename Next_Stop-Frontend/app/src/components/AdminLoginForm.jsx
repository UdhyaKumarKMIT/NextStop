import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const AdminLoginForm = ({ navigate }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
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
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div className="relative">
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={formData.username}
            onChange={handleChange}
            onFocus={() => handleFocus('username')}
            onBlur={() => handleBlur('username')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200/70 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            required
          />
          <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ${
            isFocused.username ? 'w-full' : 'w-0'
          }`}></div>
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200/70 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            required
          />
          <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ${
            isFocused.password ? 'w-full' : 'w-0'
          }`}></div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Admin Sign In"
          )}
        </button>
      </form>

      {/* Links Section */}
      <div className="mt-6 space-y-4">
        {/* Forgot Password Link */}
        <div className="text-center">
          <div
            className="group text-center cursor-pointer transition-all duration-300"
            onClick={() => navigate("/admin/forgot-password")}
          >
            <span className="inline-flex items-center text-red-200 hover:text-white transition-all duration-300 group-hover:transform group-hover:scale-105">
              Forgot Password?
              <svg 
                className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent transition-all duration-300 group-hover:w-full group-hover:opacity-100 w-0 opacity-0"></div>
          </div>
        </div>

        {/* Sign Up Link - Alternative to the button */}
        <div className="text-center">
          <div
            className="group text-center cursor-pointer transition-all duration-300"
            onClick={() => navigate("/admin/register")}
          >
            <span className="inline-flex items-center text-red-200 hover:text-white transition-all duration-300 group-hover:transform group-hover:scale-105">
              Don't have an admin account? Sign Up
              <svg 
                className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent transition-all duration-300 group-hover:w-full group-hover:opacity-100 w-0 opacity-0"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
          message.type === "success" 
            ? "bg-green-500/20 border-green-500/30" 
            : "bg-red-500/20 border-red-500/30"
        }`}>
          <p className={`text-center text-sm font-medium ${
            message.type === "success" ? "text-green-200" : "text-red-200"
          }`}>
            {message.text}
          </p>
        </div>
      )}
    </>
  );
};

export default AdminLoginForm;