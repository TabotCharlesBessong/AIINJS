// src/features/auth/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000"; // Replace with your actual API URL

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);

  if (response.data) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
