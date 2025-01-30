import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddRestaurantScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [slots, setSlots] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter restaurant name');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return false;
    }
    if (!cuisine.trim()) {
      Alert.alert('Error', 'Please enter cuisine type');
      return false;
    }
    if (!slots.trim()) {
      Alert.alert('Error', 'Please enter availability slots');
      return false;
    }
    return true;
  };

  const handleAddRestaurant = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Get the auth token
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to add a restaurant');
        return;
      }

      const restaurantData = {
        name: name.trim(),
        location: location.trim(),
        cuisine: cuisine.trim(),
        slots: slots.split(',').map(slot => slot.trim())
      };

      console.log('Sending restaurant data:', restaurantData);

      const response = await fetch('http://192.168.0.130:5000/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(restaurantData)
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add restaurant');
      }

      Alert.alert(
        'Success',
        'Restaurant added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to add restaurant. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Restaurant</Text>
      
      <Text style={styles.label}>Restaurant Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter restaurant name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
        editable={!loading}
      />

      <Text style={styles.label}>Cuisine Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter cuisine type"
        value={cuisine}
        onChangeText={setCuisine}
        editable={!loading}
      />

      <Text style={styles.label}>Available Slots</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter slots (comma separated dates)"
        value={slots}
        onChangeText={setSlots}
        editable={!loading}
        multiline
      />
      <Text style={styles.helper}>
        Format: YYYY-MM-DD HH:mm, separated by commas
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <Button
          title="Add Restaurant"
          onPress={handleAddRestaurant}
          disabled={loading}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  helper: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  }
});

export default AddRestaurantScreen;