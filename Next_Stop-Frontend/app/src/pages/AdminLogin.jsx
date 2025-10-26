import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLoginForm from "../components/AdminLoginForm";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 bg-red-400 rounded-full opacity-20 blur-xl transition-all duration-3000 ${isLoaded ? 'animate-pulse' : ''}`}></div>
        <div className={`absolute bottom-1/3 right-1/4 w-24 h-24 bg-red-300 rounded-full opacity-30 blur-lg transition-all duration-4000 ${isLoaded ? 'animate-bounce' : ''}`}></div>
        <div className={`absolute top-1/3 right-1/3 w-20 h-20 bg-red-200 rounded-full opacity-40 blur-md transition-all duration-5000 ${isLoaded ? 'animate-ping' : ''}`}></div>
        
        {/* Animated gradient orbs */}
        <div className={`absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-10 blur-3xl transition-transform duration-7000 ${isLoaded ? 'animate-spin-slow' : ''}`}></div>
        <div className={`absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-r from-red-600 to-orange-500 rounded-full opacity-10 blur-3xl transition-transform duration-9000 ${isLoaded ? 'animate-spin-slow reverse' : ''}`}></div>
      </div>

      {/* Main Admin Login Card */}
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {/* Header with elegant design */}
        <div className="relative p-8">
          {/* Decorative top border */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
          
          <div className="text-center mb-8">
            {/* Admin Logo/Icon */}
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl transform rotate-45 shadow-lg"></div>
              <div className="absolute inset-2 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl text-white font-bold transform -rotate-45">⚙️</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent mb-2">
              Admin Access
            </h1>
            <p className="text-red-200 text-lg">Secure Administrator Login</p>
          </div>

          {/* Admin Login Form */}
          <div className="space-y-6">
            <AdminLoginForm navigate={navigate} />
          </div>

          {/* Sign Up Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-red-200 text-sm mb-3">Need an admin account?</p>
              <button
                onClick={() => navigate("/admin/register")}
                className="w-full py-2 px-4 bg-transparent border-2 border-red-400 text-red-200 hover:bg-red-400 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Create Admin Account
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 mt-6 pt-4">
            <p className="text-center text-red-300/70 text-sm">
              Restricted Access • Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-300/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AdminLogin;