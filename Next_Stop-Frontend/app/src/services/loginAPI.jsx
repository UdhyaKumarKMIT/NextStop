// src/services/loginAPI.jsx
import axios from "axios";

const API_URL = "http://localhost:5000/auth/login";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(API_URL, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return token/user info
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
