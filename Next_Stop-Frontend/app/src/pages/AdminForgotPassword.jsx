import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://4.188.80.153:5050/api";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [codeSent, setCodeSent] = useState(false);
  const [resetData, setResetData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: ""
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showMessage("error", "Please enter your email");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/admin/forgot-password`, { email });
      setCodeSent(true);
      showMessage("success", "Reset code sent to your email");
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetData.code || !resetData.newPassword || !resetData.confirmPassword) {
      showMessage("error", "Please fill in all fields");
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      showMessage("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/admin/reset-password`, {
        email,
        code: resetData.code,
        newPassword: resetData.newPassword
      });
      
      showMessage("success", "Password reset successfully! You can now login.");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-700 mb-2">Admin Password Reset</h1>
          <p className="text-gray-600">
            {codeSent ? "Enter the code sent to your email" : "Enter your email to reset password"}
          </p>
        </div>

        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full border-red-300 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your admin email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reset Code
              </label>
              <input
                type="text"
                value={resetData.code}
                onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                className="input w-full border-red-300 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter 6-digit code"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                className="input w-full border-red-300 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                className="input w-full border-red-300 focus:ring-red-500 focus:border-red-500"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link
            to="/admin/login"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Back to Admin Login
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

export default AdminForgotPassword;