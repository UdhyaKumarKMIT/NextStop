import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api"; // Change to your backend URL

// Send reset code to email
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// Reset password with code
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, code, newPassword });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
