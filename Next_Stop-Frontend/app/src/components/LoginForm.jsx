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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await loginUser(formData);
      setSuccess("Login Successful ✅");
      console.log("User Data:", result);

      // Example: Store JWT in localStorage
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
    } catch (err) {
      setError(err.message || "Login Failed ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      />

      <button
        type="submit"
        className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
      >
        Login
      </button>

      {error && <p className="text-red-600 text-center">{error}</p>}
      {success && <p className="text-green-600 text-center">{success}</p>}
    </form>
  );
};

export default LoginForm;
