import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ConfirmationScreen = ({ route }) => {
  const { restaurantId, date, reservationNumber } = route.params;

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={50} color="green" />
      <Text style={styles.title}>Reservation Confirmed!</Text>
      <Text style={styles.detail}>Restaurant ID: {restaurantId}</Text>
      <Text style={styles.detail}>Date: {date.toLocaleString()}</Text>
      <Text style={styles.detail}>Reservation Number: {reservationNumber}</Text>
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
});

export default ConfirmationScreen;
