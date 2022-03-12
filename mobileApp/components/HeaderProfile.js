import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// COMPONENT BODY
export default function HeaderProfile() {
  return (
    <View style={HeaderProfileStyles.HeaderProfileStyles}>
      <Text style={{ color: "white", marginRight: "10px" }}>
        <Ionicons name="person-circle" size={25} />
      </Text>
    </View>
  );
}

// COMPONENT STYLES
const HeaderProfileStyles = StyleSheet.create({
  HeaderProfileStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    backgroundColor: "black",
    borderBottomColor: "gray",
    borderBottomWidth: "1px",
  },
});
