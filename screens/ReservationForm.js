import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import axios from "axios";

const ReservationForm = ({ route, navigation }) => {
  const { restaurantId, date, guestCount, restaurantName } = route.params;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    initStripe({
      publishableKey:
        "pk_test_51Q9ih1RuIWNyWIUihRX8W86PxHIYUxOfPoJ4KQubbplNkx6uljtZQHAMATIRVx6sOciRKO8W42Lwsr2dapCIZ5el00xFTr7iub",
    });
  }, []);

  const handleScreenPress = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Keyboard.dismiss();
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://192.168.0.130:5000/api/create-payment-intent",
        {
          amount: 1000,
          currency: "zar",
        }
      );

      const { clientSecret } = response.data;

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Your Restaurant Name",
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const { paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Error", paymentError.message);
      } else {
        Alert.alert("Success", "Payment successful! Reservation confirmed.");
        navigation.navigate("Confirmation", { reservationId: restaurantId });
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while processing your payment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.form}
        >
          <Text style={styles.sectionTitle}>Reservation Details</Text>
          <Text style={styles.detail}>Restaurant: {restaurantName}</Text>
          <Text style={styles.detail}>
            Date: {new Date(date).toLocaleString()}
          </Text>
          <Text style={styles.detail}>Guests: {guestCount}</Text>

          <Text style={styles.label}>Your Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Processing..." : "Pay Now"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReservationForm;
