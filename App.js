import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./screens/HomeScreen";
import RestaurantDetailsScreen from "./screens/RestaurantDetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import PaymentScreen from "./screens/PaymentScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import ReservationForm from "./screens/ReservationForm";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import ErrorScreen from "./screens/ErrorScreen";
import AddRestaurantScreen from "./screens/AddRestaurantScreen"; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Hide the header for the Home screen
      />
      <Stack.Screen name="Details" component={RestaurantDetailsScreen} />
      <Stack.Screen name="ReservationForm" component={ReservationForm} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}

// Admin Stack
function AdminStack() {
  return (
    <Stack.Navigator initialRouteName="AdminDashboard">
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Admin Dashboard" }}
      />
      <Stack.Screen
        name="AddRestaurant"
        component={AddRestaurantScreen}
        options={{ title: "Add Restaurant" }}
      />
    </Stack.Navigator>
  );
}

// Main App
export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51Q9ih1RuIWNyWIUihRX8W86PxHIYUxOfPoJ4KQubbplNkx6uljtZQHAMATIRVx6sOciRKO8W42Lwsr2dapCIZ5el00xFTr7iub">
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Auth") {
                iconName = focused ? "log-in" : "log-in-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              } else if (route.name === "Admin") {
                iconName = focused ? "settings" : "settings-outline";
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#6200ee",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: { backgroundColor: "#f8f8f8", height: 60 },
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen
            name="Auth"
            component={AuthStack}
            options={{ title: "Login" }}
          />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Admin" component={AdminStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}