import axios from 'axios';

// Create an Axios instance configured for the Express backend
const api = axios.create({
  baseURL: 'http://localhost:3000', // Update this if your backend runs on a different port/host
});

// Automatically attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
