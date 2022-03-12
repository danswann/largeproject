import React from "react";
import { Text, View, StyleSheet } from "react-native";

// COMPONENT BODY
export default function NotificationScreen() {
  return (
    <View style={NotificationScreenStyles.MainContainer}>
      <Text style={NotificationScreenStyles.MainText}>
        View Your Notifications!
      </Text>
    </View>
  );
}

// COMPONENT STYLES
const NotificationScreenStyles = StyleSheet.create({
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
