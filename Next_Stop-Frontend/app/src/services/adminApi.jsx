import axios from "axios";

const API_BASE_URL = "http://localhost:5050/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Bus API functions
export const busApi = {
  getAll: () => api.get("/buses"),
  create: (busData) => api.post("/buses", busData),
  update: (busNumber, busData) => api.put(`/buses/${busNumber}`, busData),
  delete: (busNumber) => api.delete(`/buses/${busNumber}`),
};

// Route API functions
export const routeApi = {
  getAll: () => api.get("/routes"),
  create: (routeData) => api.post("/routes", routeData),
  update: (routeId, routeData) => api.put(`/routes/${routeId}`, routeData),
  delete: (routeId) => api.delete(`/routes/${routeId}`),
};

export default api;