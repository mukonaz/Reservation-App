import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { makeReservation } from "../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CardField, useStripe } from "@stripe/stripe-react-native";


const ReservationForm = ({ route, navigation }) => {
  const { restaurantId, date, guestCount } = route.params;
  const [name, setName] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const { confirmPayment } = useStripe();

  const handleSubmit = async () => {
    try {
      // Create a payment intent on your server
      const { clientSecret } = await makeReservation({
        restaurantId,
        date,
        guestCount,
      });

      // Confirm the payment with Stripe
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        type: "Card",
        billingDetails: { name },
      });

      if (error) {
        navigation.navigate("Error", { message: error.message });
      } else if (paymentIntent) {
        navigation.navigate("Confirmation", {
          restaurantId,
          date,
          reservationNumber: paymentIntent.id,
        });
      }
    } catch (error) {
      navigation.navigate("Error", { message: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cardholder Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Card Details:</Text>
      <CardField
        postalCodeEnabled={false}
        placeholder={{ number: "4242 4242 4242 4242" }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />
      <Button title="Pay Now" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
  },
  cardContainer: {
    height: 50,
    marginBottom: 20,
  },
});

export default ReservationForm;
