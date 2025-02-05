import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  // Fetch user profile and reservations
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "You must be logged in to view your profile.");
        navigation.navigate("Auth"); // Redirect to login
        return;
      }

      const response = await fetch("http://192.168.1.94:5000/api/users/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setReservations(data.reservations || []); // Assume reservations are returned
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Something went wrong while fetching your profile.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userRole");
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>You must be logged in to see your profile.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.email}>Email: {user.email}</Text>

      <Text style={styles.title}>My Reservations</Text>
      {reservations.length > 0 ? (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.restaurant}</Text>
              <Text style={styles.details}>{item.date} • {item.guests} guests</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noReservations}>No reservations yet.</Text>
      )}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  email: { fontSize: 16, color: "#333", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  details: { fontSize: 14, color: "#666", marginTop: 5 },
  noReservations: { textAlign: "center", color: "#777", marginTop: 20 },
  loginButton: { backgroundColor: "#6200ee", padding: 10, borderRadius: 5, marginTop: 20 },
  logoutButton: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 20, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ProfileScreen;
