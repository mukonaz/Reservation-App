import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
