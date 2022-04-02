import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../Context";

// COMPONENT BODY
export default function HeaderProfile() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={HeaderProfileStyles.HeaderProfileStyles}>
      <TouchableOpacity style={{marginRight: 10}} onPress={() => {}} >
        <Ionicons name="person-circle" size={25} style={{ color: "white"}}/>
      </TouchableOpacity>
      <TouchableOpacity style={{marginRight: 10}} onPress={() => signOut()} >
        <Ionicons name="log-out-outline" size={25} style={{ color: "white"}}/>
      </TouchableOpacity>
    </View>
  );
}

// COMPONENT STYLES
const HeaderProfileStyles = StyleSheet.create({
  HeaderProfileStyles: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    backgroundColor: "black",
    borderBottomColor: "gray",
    borderBottomWidth: 1
  },
});
