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
          placeholderTextColor="#573C6B"
          onChangeText={(username) => setUsername(username)}
        />
      </View>

      {/* Password input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#573C6B"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      {/* Forgot Password prompt text */}
      <View style={styles.forgotView}>
        <Text style={styles.forgotText}>
          Forgot your password?{" "}
          <Text
            //onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.clickableText}
          >
            Click Here!
          </Text>
        </Text>
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.loginBtn} onPress={() => signIn()}>
        <Text style={styles.loginText}>Login</Text>
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

  // Keeps track of what the user has inputted
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  //const { signUp } = React.useContext(AuthContext);

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
          placeholderTextColor="#573C6B"
          onChangeText={(username) => setUsername(username)}
        />
      </View>

      {/* Email Address input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email Address"
          placeholderTextColor="#573C6B"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      {/* Password input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#573C6B"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      
      {/* Confirm Password input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm Password"
          placeholderTextColor="#573C6B"
          secureTextEntry={true}
          onChangeText={(confirmPassword) => setConfirmPassword(password)}
        />
      </View>

      <View style={styles.spacer}></View>

      {/* Name input fields */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="First Name"
          placeholderTextColor="#573C6B"
          onChangeText={(firstName) => setFirstName(firstName)}
        />
      </View>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Last Name"
          placeholderTextColor="#573C6B"
          onChangeText={(lastName) => setLastName(lastName)}
        />
      </View>

      <View style={styles.spacer}></View>

      {/* Email input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email Address"
          placeholderTextColor="#573C6B"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      {/* Phone number input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Phone Number"
          placeholderTextColor="#573C6B"
          onChangeText={(phone) => setPhone(phone)}
        />
      </View>

      {/* Date of birth input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Date of birth"
          placeholderTextColor="#573C6B"
          onChangeText={(DOB) => setDOB(DOB)}
        />
      </View>
    
      {/* Register button */}
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>

      {/* Login prompt text */}
      <View style={styles.signUpView}>
        <Text 
          onPress={() => navigation.navigate("Login")}
          style={styles.signUpText}
        >
           Back to {" "}
           <Text style={styles.clickableText}>
            Login
          </Text>
        </Text>
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.loginBtn} onPress={() => signUp()}>
        <Text style={styles.loginText}>SIGN UP</Text>
      </TouchableOpacity>
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
    backgroundColor: "#23192B",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginTop: 0,
    marginBottom: 30,
    height: 160,
    width: 200,
  },

  inputView: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "white",
    width: "75%",
    height: 45,
    marginBottom: 20,
  },

  spacer: {
    height: 30,
  },

  forgotView: {
    width: "60%",
    alignContent: "center",
    alignItems: "center",
  },

  forgotText: {
    marginBottom: 30,
    fontSize: 12,
    color: "white",
  },

  signUpView: {
    width: "60%",
    alignContent: "center",
    alignItems: "center",
  },

  signUpText: {
    marginTop: 20,
    fontSize: 12,
    color: "white",
  },

  clickableText: {
    fontSize: 12,
    color: "#A57FC1",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "black",
  },

  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#573C6B",
  },

  loginText: {
    color: "white",
  },
});
