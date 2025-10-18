// src/components/RegisterForm.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
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
      const result = await registerUser(formData);
      setSuccess(result.message || "Registration Successful");
      console.log("Registered User:", result);

      
      window.location.href = "/login";
     
      
      
     

    } catch (err) {
      setError(err.message || "Registration Failed ");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <InputField
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <InputField
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
        <InputField
        type="password"
        name="confirmPassword"
        placeholder="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <InputField
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <InputField
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <InputField
        type="text"
        name="mobileNo"
        placeholder="Mobile Number"
        value={formData.mobileNo}
        onChange={handleChange}
        required
      />
      <InputField
        type="text"
        name="altMobileNo"
        placeholder="Alternate Mobile Number"
        value={formData.altMobileNo}
        onChange={handleChange}
        required
      />
      <InputField
        type="date"
        name="dob"
        placeholder="Date of Birth"
        value={formData.dob}
        onChange={handleChange}
        required
      />
      <InputField
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputField
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <Button type="submit">Register</Button>

      {error && <p className="text-red-600 text-center">{error}</p>}
      {success && <p className="text-green-600 text-center">{success}</p>}
    </form>
  );
};

export default RegisterForm;
