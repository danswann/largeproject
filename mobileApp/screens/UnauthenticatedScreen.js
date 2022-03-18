import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../Context";

// Login screen
function LoginScreen({ navigation }) {
  // Keeps track of what the user has inputted
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Sign in method from context to allow us to login
  const { signIn } = React.useContext(AuthContext);

  return (
    // Main container
    <View style={styles.container}>
      {/* Soundlink logo */}
      <Image
        style={styles.image}
        resizeMethod="resize"
        resizeMode="contain"
        source={require("../assets/images/soundlinklogo.png")}
      />

      <StatusBar style="auto" />
      {/* Username input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
        />
      </View>

      {/* Password input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.loginBtn} onPress={() => signIn()}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Register prompt text */}
      <View style={styles.signUpView}>
        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text
            onPress={() => navigation.navigate("Register")}
            style={styles.clickableText}
          >
            Sign Up Here!
          </Text>
        </Text>
      </View>
    </View>
  );
}

// Register screen
function RegisterScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Register Screen</Text>
      <Text
        onPress={() => navigation.navigate("Login")}
        style={styles.clickableText}
      >
        Back to login
      </Text>
    </View>
  );
}

// Navigation between login and register screens
function UnauthenticatedScreen() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default UnauthenticatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 30,
    height: 160,
    width: 200,
  },

  inputView: {
    backgroundColor: "gray",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
  },

  signUpView: {
    width: "50%",
    alignContent: "center",
    alignItems: "center",
  },

  signUpText: {
    marginTop: 40,
    fontSize: 10,
    color: "white",
  },

  clickableText: {
    fontSize: 10,
    color: "#573C6B",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    backgroundColor: "#573C6B",
  },
});
