import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const RestaurantDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { restaurant } = route.params;
  const [date, setDate] = useState(null);
  const [guestCount, setGuestCount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleReservation = () => {
    if (!date || !guestCount || parseInt(guestCount) < 1) {
      Toast.show({ type: "error", text1: "Please complete all fields!" });
      return;
    }
    navigation.navigate("ReservationForm", {
      restaurantId: restaurant._id,
      date,
      guestCount: parseInt(guestCount),
      restaurantName: restaurant.name,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Image source={{ uri: restaurant.image || "https://via.placeholder.com/300" }} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.details}>{restaurant.location} • {restaurant.cuisine}</Text>
            <Text style={styles.description}>Reserve a table and enjoy the best {restaurant.cuisine} dishes!</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Select Date and Time:</Text>
            <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar-today" size={20} color="#fff" />
              <Text style={styles.buttonText}>{date ? date.toLocaleString() : "Select Date and Time"}</Text>
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
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Number of Guests:</Text>
            <View style={styles.inputContainer}>
              <Icon name="group" size={20} color="#666" />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={guestCount}
                onChangeText={setGuestCount}
                maxLength={2}
                returnKeyType="done"
                placeholder="Enter number of guests"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, (!date || !guestCount || parseInt(guestCount) < 1) && styles.buttonDisabled]}
              onPress={handleReservation}
              disabled={!date || !guestCount || parseInt(guestCount) < 1}
            >
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reserve Now</Text>
            </TouchableOpacity>
          </View>
          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  detailsContainer: {
    padding: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 16,
    color: "#777",
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
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
    backgroundColor: "#ff6347",
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