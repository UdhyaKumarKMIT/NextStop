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
  const navigate = useNavigate();

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username *"
        className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email *"
        className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
      >
        <option value="admin">Admin</option>
        <option value="superadmin">Super Admin</option>
      </select>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password *"
        className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password *"
        className="w-full border border-red-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Create Admin Account"}
      </button>

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
    </form>
  );
};

export default AdminRegisterForm;
