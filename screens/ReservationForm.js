import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native';
import { makeReservation } from '../services/api';

export default function ReservationForm() {
  const [restaurantId, setRestaurantId] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    makeReservation({ restaurant: restaurantId, date });
  };

  return (
    <View>
      <TextInput placeholder="Restaurant ID" onChangeText={setRestaurantId} />
      <TextInput placeholder="Date" onChangeText={setDate} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
