// src/utils/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Your Spring Boot backend URL

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;  // Return the response from the backend
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;  // Return the response from the backend (usually JWT)
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
