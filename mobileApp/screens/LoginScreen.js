import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AuthContext } from "../Context";

const LoginScreen = () => {
  // Grabbing the signin and signup functions from the context
  const { signIn, signUp } = React.useContext(AuthContext);
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.MainText}>Login/Register Screen</Text>
      <TouchableOpacity style={styles.Button} onPress={() => signIn()}>
        <Text style={styles.ButtonText}>Login Button</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Button} onPress={() => signUp()}>
        <Text style={styles.ButtonText}>Register Button</Text>
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
    backgroundColor: "#23192B",
  },
  MainText: {
    color: "white",
  },
  Button: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    marginTop: 10
  },
  ButtonText: {
    color: "black",
  },
});
