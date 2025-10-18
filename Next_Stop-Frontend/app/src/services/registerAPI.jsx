// src/services/registerAPI.jsx
import axios from "axios";

const API_URL = "http://localhost:5050/api/auth/register";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.response && error.response.data) {
      throw new Error(JSON.stringify(error.response.data));
    } else {
      throw new Error(error.message || "Registration failed");
    }
  }
};
