import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust this to match your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/signup', userData),
};

export const locationAPI = {
  getAll: () => api.get('/locations'),
  create: (data) => api.post('/locations', data),
  // Add other endpoints as needed
};

// Add similar exports for transportation and route APIs

export default api;