import { StyleSheet, Text, View } from "react-native";
import React from "react";

const RegisterScreen = () => {
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.MainText}>RegisterScreen</Text>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
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
