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
  Alert,
  ScrollView,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";

const ReservationForm = ({ route, navigation }) => {
  const { restaurantId, date, guestCount, restaurantName } = route.params;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { confirmPayment } = useStripe();

  const handleCardChange = (cardDetails) => {
    if (cardDetails) {
      setCardComplete(cardDetails.complete);
      console.log("Card details changed:", cardDetails.complete);
    }
  };

  const handleScreenPress = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Keyboard.dismiss();
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter cardholder name");
      return;
    }

    if (!cardComplete) {
      Alert.alert("Error", "Please enter valid card details");
      return;
    }

    try {
      setLoading(true);

      const requestPayload = {
        restaurantId,
        date,
        guestCount,
        customerName: name,
      };
      console.log('Request payload:', requestPayload);

      const reservationResponse = await fetch(
        "http://192.168.0.130:5000/api/reservations/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      const reservationData = await reservationResponse.json();

      if (!reservationResponse.ok) {
        throw new Error(reservationData.message || 'Server returned error status');
      }

      const { clientSecret, reservationId } = reservationData;

      if (!clientSecret) {
        throw new Error("Server did not provide a client secret");
      }

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name,
          },
        },
      });

      if (error) {
        console.error('Stripe error:', error);
        throw new Error(error.message);
      }

      navigation.navigate("Confirmation", {
        reservationId,
      });

    } catch (error) {
      console.error("Full error details:", error);
      Alert.alert(
        "Payment Failed",
        error.message || "There was an error processing your payment"
      );
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
          <Text style={styles.detail}>Date: {new Date(date).toLocaleString()}</Text>
          <Text style={styles.detail}>Guests: {guestCount}</Text>

          <Text style={styles.label}>Cardholder Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <Text style={styles.label}>Card Details:</Text>
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={styles.card}
            style={styles.cardContainer}
            onCardChange={handleCardChange}
            disabled={loading}
          />

          <Button
            title={loading ? "Processing..." : "Pay Now"}
            onPress={handleSubmit}
            disabled={loading || !cardComplete || !name.trim()}
          />

          <Text style={styles.cardStatus}>
            {cardComplete ? "✓ Card details complete" : "Enter card details"}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    color: '#666',
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
  card: {
    backgroundColor: "#efefefef",
    textColor: "#000000",
  },
  cardContainer: {
    height: 50,
    marginBottom: 20,
  },
  cardStatus: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  }
});

export default ReservationForm;