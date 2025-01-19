import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const ProfileScreen = () => {
  const reservations = [
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
  ];

  return (
    <View style={styles.container}>
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
