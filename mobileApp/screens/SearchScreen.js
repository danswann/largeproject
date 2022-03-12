import React from "react";
import { Text, View, StyleSheet } from "react-native";

// COMPONENT BODY
export default function SearchScreen() {
  return (
    <View style={SearchScreenStyles.MainContainer}>
      <Text style={SearchScreenStyles.MainText}>Search</Text>
    </View>
  );
}

// COMPONENT STYLES
const SearchScreenStyles = StyleSheet.create({
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
