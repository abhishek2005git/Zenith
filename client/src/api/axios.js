import axios from 'axios';

const api = axios.create({
  // Vite uses import.meta.env to access variables
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // Crucial for sending cookies to the backend
});

export default api;
