import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([
    {
      id: "1",
      restaurant: "Ocean's Dine",
      date: "2025-01-21 7:00 PM",
      guests: 4,
    },
    {
      id: "2",
      restaurant: "Taste of Italy",
      date: "2025-01-23 8:00 PM",
      guests: 2,
    },
  ]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          // Redirect to login if no token exists
          Alert.alert("Error", "You must be logged in to view your profile.");
          return;
        }

        const response = await fetch(
          "http://192.168.1.132:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the request header
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert(
          "Error",
          "Something went wrong while fetching your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>You must be logged in to see your profile.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.email}>Email: {user.email}</Text>

      <Text style={styles.title}>My Reservations</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.restaurant}</Text>
            <Text style={styles.details}>
              {item.date} • {item.guests} guests
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default ProfileScreen;
