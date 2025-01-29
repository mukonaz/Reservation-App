import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Button
        title="Add Restaurant"
        onPress={() => navigation.navigate('AddRestaurant')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AdminDashboardScreen;