import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ErrorScreen = ({ route }) => {
  const { message } = route.params;

  return (
    <View style={styles.container}>
      <Icon name="error" size={50} color="red" />
      <Text style={styles.title}>Something Went Wrong!</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "red",
  },
});

export default ErrorScreen;
