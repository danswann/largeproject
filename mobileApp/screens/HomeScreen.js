import React from "react";
import { Text, View, StyleSheet } from "react-native";

// COMPONENT BODY
export default function HomeScreen() {
  return (
    <View style={HomeScreenStyles.HomeScreenStyles}>
      <Text style={{ color: "white" }}>Home!</Text>
    </View>
  );
}

// COMPONENT STYLES
const HomeScreenStyles = StyleSheet.create({
  HomeScreenStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23192B",
  },
});
