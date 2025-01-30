import React, { useState } from "react";
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
} from "react-native";
import { makeReservation } from "../services/api";
import { CardField, useStripe } from "@stripe/stripe-react-native";

const ReservationForm = ({ route, navigation }) => {
  const { restaurantId, date, guestCount } = route.params;
  const [name, setName] = useState("");
  const [cardDetails, setCardDetails] = useState(null);
  const { confirmPayment } = useStripe();

  const handleSubmit = async () => {
    try {
      const { clientSecret, reservation } = await makeReservation({
        restaurantId,
        date,
        guestCount,
      });

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
          reservationId: reservation._id,
        });
      }
    } catch (error) {
      navigation.navigate("Error", { message: error.message });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
        <View>
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
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
