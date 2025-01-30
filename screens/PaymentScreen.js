import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";

const PaymentScreen = () => {
  const [name, setName] = useState("");
  const fixedAmount = 200; // Fixed reservation price in Rands
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    if (!name) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    try {
      // Call backend to create payment intent
      const response = await fetch(
        "http://192.168.0.130/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(fixedAmount * 100), // Convert to smallest currency unit
            currency: "zar", // Use ZAR for South African Rand
          }),
        }
      );

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
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