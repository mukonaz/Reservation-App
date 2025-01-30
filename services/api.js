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

export const makeReservation = async ({ restaurantId, date, guestCount }) => {
  try {
    const response = await fetch("http://192.168.0.130:5000/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantId,
        date,
        guestCount,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create reservation");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error creating reservation: " + error.message);
  }
};