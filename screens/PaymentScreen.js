import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { makeReservation } from "../services/api";

const PaymentScreen = () => {
  const [name, setName] = useState("");
  const fixedAmount = 200;
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    if (!name) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    try {
      // First make the reservation
      const reservationData = {
        customerName: name,
        date: new Date(), // You should pass the actual selected date
        guestCount: 1,   // Pass the actual guest count
        restaurantId: "67914f38e99134aecec6f142" // Pass the actual restaurant ID
      };

      await makeReservation(reservationData);

      // Then handle payment
      const response = await fetch(
        "http://192.168.1.94/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Add token here too
          },
          body: JSON.stringify({
            amount: Math.round(fixedAmount * 100),
            currency: "zar",
          }),
        }
      );

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: { name },
        },
      });

      if (error) {
        Alert.alert("Payment Failed", error.message);
      } else if (paymentIntent) {
        Alert.alert("Payment Successful", `Payment ID: ${paymentIntent.id}`);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Payment</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.fixedAmountText}>
        Reservation Price: R{fixedAmount}
      </Text>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />
      <Button
        title={`Pay Now R${fixedAmount}`} // Display the amount in the button title
        onPress={handlePayment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  fixedAmountText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    textColor: "#000",
  },
  cardContainer: {
    height: 50,
    marginVertical: 15,
  },
});

export default PaymentScreen;