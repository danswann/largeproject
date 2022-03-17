import React from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../Context";

// COMPONENT BODY
export default function HeaderProfile() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={HeaderProfileStyles.HeaderProfileStyles}>
      <Text style={{ color: "white", marginRight: "10px" }}>
        <Ionicons name="person-circle" size={25} />
      </Text>
      <TouchableHighlight onPress={() => signOut()} underlayColor="#573C6B">
        <Text style={{ color: "white", marginRight: "10px" }}>
          <Ionicons name="log-out-outline" size={25} />
        </Text>
      </TouchableHighlight>
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
    borderBottomWidth: "1px",
  },
});
