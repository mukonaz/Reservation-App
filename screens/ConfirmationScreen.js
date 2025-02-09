import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const ConfirmationScreen = ({ route }) => {
  const { reservationId } = route.params;
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        console.log("Sending Token:", token); // Debugging log

        const response = await fetch(
          `http://192.168.0.130:5000/api/reservations/${reservationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setReservation(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={50} color="green" />
      <Text style={styles.title}>Reservation Confirmed!</Text>
      <Text style={styles.detail}>Restaurant: {reservation.restaurant.name}</Text>
      <Text style={styles.detail}>Date: {new Date(reservation.date).toLocaleString()}</Text>
      <Text style={styles.detail}>Reservation Number: {reservation.paymentIntentId}</Text>
      <Text style={styles.detail}>Guest Count: {reservation.guestCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});

export default ConfirmationScreen;
