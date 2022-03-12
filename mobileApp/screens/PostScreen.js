import React from "react";
import { Text, View, StyleSheet } from "react-native";

// COMPONENT BODY
export default function PostScreen() {
  return (
    <View style={PostScreenStyles.MainContainer}>
      <Text style={PostScreenStyles.MainText}>Create a Post!</Text>
    </View>
  );
}

// COMPONENT STYLES
const PostScreenStyles = StyleSheet.create({
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
