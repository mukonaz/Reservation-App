import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  const [date, setDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleReservation = () => {
    if (!date || guestCount < 1) {
      Toast.show({ type: "error", text1: "Please complete all fields!" });
      return;
    }
    // Mock reservation submission
    console.log("Reservation Details:", {
      restaurant: restaurant.name,
      date,
      guestCount,
    });
    Toast.show({ type: "success", text1: "Reservation Confirmed!" });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/300" }}
        style={styles.image}
      />
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.details}>
        {restaurant.location} • {restaurant.cuisine}
      </Text>
      <Text style={styles.description}>
        Reserve a table and enjoy the best {restaurant.cuisine} dishes!
      </Text>

      {/* Reservation Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Select Date and Time:</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar-today" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {date ? date.toLocaleString() : "Select Date and Time"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        <Text style={styles.label}>Number of Guests:</Text>
        <View style={styles.inputContainer}>
          <Icon name="group" size={20} color="#666" />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={guestCount.toString()}
            onChangeText={(value) => setGuestCount(Number(value))}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleReservation}>
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Reserve Now</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginVertical: 10,
    lineHeight: 22,
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RestaurantDetailsScreen;
