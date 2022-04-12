import React, { useState, useEffect } from "react";
import { API_URL } from "../constants/Info";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedbackBase,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { AuthContext } from "../Context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
export default function PasswordChangeScreen({ route, navigation }) {
  

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="InputEmail"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="InputEmail" component={InputEmailScreen} />
      <Stack.Screen name="CheckVerified" component={CheckVerifiedScreen} initialParams={{email: ""}}/>
    </Stack.Navigator>
  );
}
function InputEmailScreen({ route, navigation }) {
  // Keeps track of what the user has inputted

  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState("");
  const [loading, setLoading] = useState(false);

  async function tryEmail()
  {
    if(!loading) {
      setLoading(true)
      setEmailState(await verifyEmailData())
      setLoading(false)
    }
  }

  async function verifyEmailData()
  {
    if (email === "")
      return "Email field must be filled"
    else if (!verifyEmailFormat(email)) 
      return "Email format is invalid"
    else if (!await sendEmail(email))
    {
      return "No user found with this email addrees."
    }
    navigation.navigate("CheckVerified", {email: email})
    return ""
  }

  function verifyEmailFormat(email) //verifies format of string@string.string
  {
    var reg = /\S+@\S+\.\S+/;
    return reg.test(email);
  }

  async function sendEmail(email)
  {
    return new Promise((res, rej) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email: email})
    };
    fetch(`${API_URL}/api/user/forgotPassword`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(response.ok)
          res(true)
        else
        {
          console.log(response.error)
          res(false)
        }
      })
    })
  }

  return (
    // Pushes content up when keyboard is blocking it
    // Main container
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {/* // Main container */}
      <View style={styles.container}>
        {/* Soundlink logo */}
        <Image
          style={styles.image}
          resizeMethod="resize"
          resizeMode="contain"
          source={require("../assets/images/soundlinklogo.png")}
        />
        <Text style={[styles.loginText, {marginBottom: 20}]}>Please enter your account's email address.</Text>
        {/* Email Address input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email Address"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            keyboardType="email-address"
            autoCompleteType="email"
            onChangeText={(email) => setEmail(email)}
          />
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => tryEmail()}
        >
          <View style={{flexDirection:"row"}}>
            {loading ? (<ActivityIndicator size="small" color="white" style={{marginRight:5}} />) : (<View></View>)}
            <Text style={styles.loginText}>Continue</Text>
          </View>
        </TouchableOpacity>

        {/* Conditionally renders error message if user enters invalid information */}
        <Text style={styles.errorText}>{emailState}</Text>

        {/* Back to login */}
        <View style={styles.backToLoginView}>
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.signUpText}
          >
            Back To{" "}
            <Text style={styles.clickableText}>Login</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
function CheckVerifiedScreen({ route, navigation }) {
  const email = route.params.email;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState("");

  const { getHash } = React.useContext(AuthContext);

  function checkPasswords()
  {
    if (password === "")
      return "Password field must be filled"
    else if (password !== confirmPassword) 
      return "Password do not match"
    return ""
  }
  async function checkVerified()
  {
    setLoading(true)
    const error = checkPasswords()
    if(error != "")
    {
      setErrorState(error)
      setLoading(false)
    }
    else{ 
      const hashedPassword = await getHash(password)
      if(await changePasswordByEmail(email, hashedPassword))
      {
        navigation.navigate("Login")
      }
      else
      {
        setErrorState("Please verify your email before changing password.")
        setLoading(false)
      }
    }
  }
  function changePasswordByEmail(email, hashedPassword)
  {
    return new Promise((res, rej) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email: email, password: hashedPassword})
      };
      fetch(`${API_URL}/api/user/changePasswordByEmail`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
          if(!response.ok)
          {
            console.log(response.error)
            res(false)
          }
          else{
            res(true)
          }
        })
    })
  }

  return (
    <View style={styles.container}>
      {/* Soundlink logo */}
      <Image
        style={styles.image}
        resizeMethod="resize"
        resizeMode="contain"
        source={require("../assets/images/soundlinklogo.png")}
      />
      <Text style={styles.signUpText}>
          We've just sent an email to:
      </Text>
      <Text style={styles.emailText}>
        {email}
      </Text>
      <Text style={styles.signUpText}>
          Please verify your email to reset password.
      </Text>
      {/* Password input field */}
      <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

      {/* Confirm Password input field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm Password"
          placeholderTextColor="white"
          clearButtonMode="while-editing"
          selectionColor={"#573C6B"}
          secureTextEntry={true}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
        />
      </View>

      <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => checkVerified()}
      >
        <View style={{flexDirection:"row"}}>
            {loading ? (<ActivityIndicator size="small" color="white" style={{marginRight:5}} />) : (<View></View>)}
            <Text style={styles.loginText}>Apply and Continue</Text>
        </View>
      </TouchableOpacity>
      {/* Conditionally renders error message if user is unverified */}
      <Text style={styles.errorText}>{errorState}</Text>
      {/* Back to login */}
      <View style={styles.backToLoginView}>
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.signUpText}
          >
            Back To{" "}
            <Text style={styles.clickableText}>Login</Text>
          </Text>
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23192B",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginTop: 50,
    marginBottom: 30,
    height: 160,
    width: 200,
  },

  inputView: {
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    width: "75%",
    height: 45,
    marginBottom: 20,
  },

  signUpText: {
    marginBottom: 20,
    fontSize: 12,
    color: "white",
  },

  errorText: {
    marginVertical: 10,
    color: "red",
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
    color: "white",
  },

  backToLoginView: {
    width: "60%",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 50,
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

  emailText: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 20,
  },
})