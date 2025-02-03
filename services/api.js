import axios from 'axios';

const API = axios.create({ baseURL: "http://192.168.0.130:5000" });
const API_URL = "http://192.168.0.130:5000/api/restaurants"; // Replace w
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

export const getReservations = async (token) => {
  try {
    const response = await API.get("/api/reservations/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};


export const makeReservation = async ({ restaurantId, date, guestCount, customerName }) => {
  try {
    // Get the token from localStorage or your auth state management
    const token = localStorage.getItem('token'); // or however you store your auth token
    
    const response = await fetch("http://192.168.0.130:5000/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Add the authentication token
      },
      body: JSON.stringify({
        restaurantId,
        date,
        guestCount,
        customerName
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create reservation");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error creating reservation: " + error.message);
  }
};