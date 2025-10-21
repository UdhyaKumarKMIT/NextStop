// src/components/AdminLoginForm.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

const AdminLoginForm = ({ navigate }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p
        className="text-center mt-4 text-red-600 hover:underline cursor-pointer"
        onClick={() => navigate("/admin/forgot-password")}
      >
        Forgot Password?
      </p>

      {message.text && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </>
  );
};

export default AdminLoginForm;
