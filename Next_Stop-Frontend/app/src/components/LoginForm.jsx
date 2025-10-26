// src/components/LoginForm.jsx
import React, { useState } from "react";
import { loginUser } from "../services/loginAPI";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await loginUser(formData);
      setSuccess(result.message || "Login Successful");
      console.log("User Data:", result);

      // Example: Store JWT in localStorage
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      // Redirect to dashboard or home page
      window.location.href = "/booking";
    } catch (err) {
      setError(err.message || "Login Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Input */}
      <div className="relative">
        <input
          type="text"
          name="username"
          placeholder="Username"
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
        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      >
        Login
      </button>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <p className="text-red-200 text-center text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
          <p className="text-green-200 text-center text-sm">{success}</p>
        </div>
      )}
    </form>
  );
};

export default LoginForm;