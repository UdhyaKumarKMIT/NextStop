import React, { useState } from "react";
import { registerUser } from "../services/registerAPI";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    altMobileNo: "",
    dob: "",
    email: "",
    address: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFocused, setIsFocused] = useState({});

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
      const result = await registerUser(formData);
      setSuccess(result.message || "Registration Successful");
      console.log("Registered User:", result);

      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Registration Failed");
    }
  };

  // Render input field directly
  const renderInputField = (type, name, placeholder, required = true) => (
    <div className="relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        onFocus={() => handleFocus(name)}
        onBlur={() => handleBlur(name)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-red-200/70 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
        required={required}
      />
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 ${
        isFocused[name] ? 'w-full' : 'w-0'
      }`}></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Row - Username and Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField("text", "username", "Username")}
        {renderInputField("password", "password", "Password")}
      </div>

      {/* Second Row - Confirm Password and First Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField("password", "confirmPassword", "Confirm Password")}
        {renderInputField("text", "firstName", "First Name")}
      </div>

      {/* Third Row - Last Name and Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField("text", "lastName", "Last Name")}
        {renderInputField("text", "mobileNo", "Mobile Number")}
      </div>

      {/* Fourth Row - Alt Mobile and DOB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField("text", "altMobileNo", "Alternate Mobile")}
        {renderInputField("date", "dob", "Date of Birth")}
      </div>

      {/* Fifth Row - Email and Address */}
      <div className="grid grid-cols-1 gap-4">
        {renderInputField("email", "email", "Email Address")}
        {renderInputField("text", "address", "Full Address")}
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      >
        Register
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

export default RegisterForm;