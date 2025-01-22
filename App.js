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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={RestaurantDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

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

export default function App() {
  return (
    <StripeProvider publishableKey="your-publishable-key">
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
          <Tab.Screen name="Admin" component={AdminDashboardScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
