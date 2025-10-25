import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5050/api";

const AdminRegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isFocused, setIsFocused] = useState({});
  const navigate = useNavigate();

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

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      showMessage("error", "Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showMessage("error", "Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      showMessage("error", "Password must be at least 6 characters long");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showMessage("error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/admin/register`, formData);
      showMessage("success", "Admin account created! Redirecting to login...");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div className="relative">
        <input
          type="text"
          name="username"
          placeholder="Username *"
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

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200/70 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
          required
        />
        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ${
          isFocused.email ? 'w-full' : 'w-0'
        }`}></div>
      </div>

      {/* Role Selection */}
      <div className="relative">
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          onFocus={() => handleFocus('role')}
          onBlur={() => handleBlur('role')}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none"
        >
          <option value="admin" className="bg-red-800 text-white">Admin</option>
          <option value="superadmin" className="bg-red-800 text-white">Super Admin</option>
        </select>
        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ${
          isFocused.role ? 'w-full' : 'w-0'
        }`}></div>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type="password"
          name="password"
          placeholder="Password *"
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

      {/* Confirm Password */}
      <div className="relative">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={handleChange}
          onFocus={() => handleFocus('confirmPassword')}
          onBlur={() => handleBlur('confirmPassword')}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200/70 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
          required
        />
        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ${
          isFocused.confirmPassword ? 'w-full' : 'w-0'
        }`}></div>
      </div>

      {/* Register Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Account...
          </div>
        ) : (
          "Create Admin Account"
        )}
      </button>

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
    </form>
  );
};

export default AdminRegisterForm;