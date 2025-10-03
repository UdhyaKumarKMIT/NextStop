// src/services/registerAPI.jsx
import axios from "axios";

const API_URL = "http://localhost:5000/auth/register";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
