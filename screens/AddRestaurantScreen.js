import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AddRestaurantScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [slots, setSlots] = useState('');

  const handleAddRestaurant = async () => {
    const restaurantData = {
      name,
      location,
      cuisine,
      slots: slots.split(',').map(slot => new Date(slot.trim()))
    };

    try {
      const response = await axios.post('http://192.168.1.132:5000/api/restaurants', restaurantData);
      Alert.alert("Success", "Restaurant added successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add restaurant");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine"
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput
        style={styles.input}
        placeholder="Slots (comma separated dates)"
        value={slots}
        onChangeText={setSlots}
      />
      <Button title="Add Restaurant" onPress={handleAddRestaurant} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddRestaurantScreen;