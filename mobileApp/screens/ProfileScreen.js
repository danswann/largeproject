import React from "react";
import { Text, View, StyleSheet } from "react-native";

// COMPONENT BODY
export default function ProfileScreen() {
  return (
    <View style={ProfileScreenStyles.MainContainer}>
      <Text style={{ color: "white" }}>View Your Profile!</Text>
    </View>
  );
}

// COMPONENT STYLES
const ProfileScreenStyles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  MainText: {
    color: "white",
  },
});
