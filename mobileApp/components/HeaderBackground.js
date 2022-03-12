import React from "react";
import { Text, View, StyleSheet } from "react-native";

// COMPONENT BODY
export default function HeaderBackground() {
  return <View style={HeaderBackgroundStyles.HeaderBackgroundStyles}></View>;
}

// COMPONENT STYLES
const HeaderBackgroundStyles = new StyleSheet.create({
  HeaderBackgroundStyles: {
    flex: 1,
    backgroundColor: "black",
    borderBottomColor: "gray",
    borderBottomWidth: "1px",
  },
});
