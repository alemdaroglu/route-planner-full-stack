import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/api';

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
  getCurrentUser: () => api.get('/auth/me'),
};

export const locationAPI = {
  getAll: () => api.get('/locations'),
  getAllPaginated: (page, size, sortBy, ascending) => 
    api.get(`/locations?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.patch(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

export const transportationAPI = {
  getAll: () => api.get('/transportations'),
  getAllPaginated: (page, size, sortBy, ascending) => 
    api.get(`/transportations?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`),
  create: (data) => api.post('/transportations', data),
  update: (id, data) => api.patch(`/transportations/${id}`, data),
  delete: (id) => api.delete(`/transportations/${id}`),
};

export const routeAPI = {
  search: (origin, destination, date) => {
    const params = new URLSearchParams({ origin, destination, date });
    return api.get(`/routes?${params}`);
  },
};

// Utility functions moved from utils/api.js
export const fetchAllLocations = async () => {
  let allLocations = [];
  let currentPage = 0;
  let hasMore = true;
  const size = 50; // Using a larger page size for efficiency

  while (hasMore) {
    try {
      const response = await locationAPI.getAllPaginated(currentPage, size, 'locationCode', true);
      allLocations = [...allLocations, ...response.data.content];
      hasMore = !response.data.last;
      currentPage++;
    } catch (err) {
      console.error('Error fetching locations:', err);
      break;
    }
  }

  return allLocations;
};

export default api;