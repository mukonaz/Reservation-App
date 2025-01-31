import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  useColorScheme,
  Appearance,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getRestaurants } from "../services/api";
import { useTheme } from "@react-navigation/native"; // For dark mode support

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Detect system theme
  const { colors } = useTheme(); // Use theme colors

  useEffect(() => {
    // Fetch restaurants from the backend
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants();
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }, // Dynamic background color
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.primary }, // Dynamic header color
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Restaurants</Text>
        <Ionicons
          name="restaurant"
          size={28}
          color={colors.text} // Dynamic icon color
        />
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card }, // Dynamic search bar color
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.text} // Dynamic icon color
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]} // Dynamic text color
          placeholder="Search restaurants..."
          placeholderTextColor={colors.text} // Dynamic placeholder color
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { restaurant: item })}
          >
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card }, // Dynamic card color
              ]}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.details, { color: colors.text }]}>
                  {item.location} • {item.cuisine}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;