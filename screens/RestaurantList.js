import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getReservations } from '../services/api';

const ReservationListScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        Alert.alert("Authentication Required", "Please log in to view reservations", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
        return;
      }
  
      const response = await getReservations(token);
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      Alert.alert("Error", "Unable to load reservations. Please try again.", [
        { text: "Retry", onPress: fetchReservations },
        { text: "OK", style: "cancel" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  const renderReservation = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.restaurantName}>{item.restaurant?.name || 'Unknown Restaurant'}</Text>
      <Text style={styles.detail}>Customer: {item.customerName}</Text>
      <Text style={styles.detail}>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.detail}>Guests: {item.guestCount}</Text>
      <Text style={styles.detail}>Status: 
        <Text style={[styles.status, { color: item.status === 'confirmed' ? 'green' : 'orange' }]}>
          {' ' + item.status}
        </Text>
      </Text>
      {item.paymentIntentId && (
        <Text style={styles.detail}>Payment ID: {item.paymentIntentId}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Reservations</Text>
      {reservations.length === 0 ? (
        <Text style={styles.noReservations}>No reservations found</Text>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderReservation}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchReservations}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  status: {
    fontWeight: 'bold',
  },
  noReservations: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  }
});

export default ReservationListScreen;