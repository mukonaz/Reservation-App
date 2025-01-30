import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const RestaurantDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { restaurant } = route.params;
  const [date, setDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleReservation = () => {
    if (!date || guestCount < 1) {
      Toast.show({ type: "error", text1: "Please complete all fields!" });
      return;
    }

    // Log the restaurant object to verify the data
    console.log('Restaurant data:', restaurant);

    // Use _id instead of id for consistency with MongoDB
    navigation.navigate("ReservationForm", {
      restaurantId: restaurant._id, // Changed from restaurant.id to restaurant._id
      date,
      guestCount,
      restaurantName: restaurant.name // Adding restaurant name for reference
    });
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
            minimumDate={new Date()} // Prevent past dates
          />
        )}
        <Text style={styles.label}>Number of Guests:</Text>
        <View style={styles.inputContainer}>
          <Icon name="group" size={20} color="#666" />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={guestCount.toString()}
            onChangeText={(value) => {
              const number = parseInt(value);
              if (!isNaN(number) && number > 0) {
                setGuestCount(number);
              }
            }}
            maxLength={2} // Prevent unreasonably large numbers
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.button,
            (!date || guestCount < 1) && styles.buttonDisabled
          ]} 
          onPress={handleReservation}
          disabled={!date || guestCount < 1}
        >
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
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RestaurantDetailsScreen;