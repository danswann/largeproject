import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function EditProfileScreen() {
  return (
    <View style={styles.MainContainer}>
      <Text style={{color: "white"}}>Edit Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23192B",
  },
});
