import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const LoginScreen = () => {
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.MainText}>LoginScreen</Text>
      <TouchableOpacity
        style={styles.Button}
        onPress={() => {
          alert("Button Pressed");
        }}
      >
        <Text style={styles.ButtonText}>Login Button</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  Button: {
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "5px",
  },
  ButtonText: {
    color: "black",
  },
});
