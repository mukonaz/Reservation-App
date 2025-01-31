import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await api.post('/users/register', { email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// services/restaurantService.js
export const getRestaurants = async () => {
  const response = await api.get('/restaurants');
  return response.data;
};

export const getRestaurantDetails = async (restaurantId) => {
  const response = await api.get(`/restaurants/${restaurantId}`);
  return response.data;
};

// services/reservationService.js
export const createReservation = async (restaurantId, date) => {
  const response = await api.post('/reservations', { restaurantId, date });
  return response.data;
};

export const getUserReservations = async () => {
  const response = await api.get('/reservations/user');
  return response.data;
};


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://YOUR_BACKEND_URL/api', // Replace with actual backend URL
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

"http://192.168.1.87:5000/api/users/login"