import axios from 'axios';

const API = axios.create({ baseURL: "http://192.168.1.132:5000" });
const API_URL = "http://192.168.1.132:5000/api/restaurants"; // Replace w
export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
export const getRestaurants = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};
