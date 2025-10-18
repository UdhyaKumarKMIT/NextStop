import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../services/resetAPI";
import { useNavigate } from "react-router-dom";

const ResetForm = () => {
  const [step, setStep] = useState(1); // Step 1: send code, Step 2: reset password
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await forgotPassword(formData.email);
      setSuccess(res.message);
      setStep(2); // Move to reset password step

      
    } catch (err) {
      setError(err.message || "Failed to send reset code ");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await resetPassword(formData.email, formData.code, formData.newPassword);
      setSuccess(res.message);
      setStep(1); // Optional: redirect or reset form
      setFormData({ email: "", code: "", newPassword: "" });

      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to reset password ");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      {step === 1 && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <h2 className="text-2xl text-center mb-4">Forgot Password</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
          >
            Send Reset Code
          </button>

          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <h2 className="text-2xl text-center mb-4">Reset Password</h2>

          <input
            type="text"
            name="code"
            placeholder="6-digit Code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
          >
            Reset Password
          </button>

          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
        </form>
      )}
    </div>
  );
};

export default ResetForm;
