import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { getRestaurants } from '../services/api';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getRestaurants().then(({ data }) => setRestaurants(data));
  }, []);

  return (
    <View>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.cuisine}</Text>
        )}
      />
    </View>
  );
}
