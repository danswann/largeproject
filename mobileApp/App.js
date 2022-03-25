import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthenticatedScreen from "./screens/AuthenticatedScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthContext } from "./Context";
import UnauthenticatedScreen from "./screens/UnauthenticatedScreen";
import { API_URL } from "./constants/Info";

const LoggedOutStack = createNativeStackNavigator();
const LoggedInStack = createNativeStackNavigator();

export default function App() {
  // Initial state
  const initialLoginState = {
    isLoading: true,
    username: null,
    userToken: null,
  };

  // Reducer function
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          username: action.id,
          userToken: action.token,
          userVerified: action.verified,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          username: null,
          userToken: null,
          userVerified: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userVerified: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  // Context functions that can change the authentication status of the user
  const authContext = React.useMemo(() => {
    return {
      signIn: (username, password) => {
        return new Promise((res, rej) => {
          // User token will store the users unique id
          let userToken;
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password }),
          };
          fetch(`${API_URL}/api/user/login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              console.log(data.ok);
              // data.ok will be true if a valid user is attempting to log in
              if (data.ok === true) {
                // We then set the valid users token and email to verify them
                userToken = data.user._id;
                userVerified = data.user.isVerified
                // We then check if the user is valid and the email has been verified
                dispatch({ type: "LOGIN", id: username, token: userToken, verified: userVerified });
                res(false);
              } else {
                console.log("Invalid username or password");
                res(true);
              }
            });
        });
      },
      signUp: (
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        dob
      ) => {
        // Object that specifies what we need for the request since it is a POST
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: password,
            dob: dob,
          }),
        };
        fetch(`${API_URL}/api/user/register`, requestOptions)
          .then((response) => response.text())
          .then((data) => {
            console.log(data.ok);
            // data.ok will be true if a user has been successfully added to database
            if (data.ok === true) {
              // We then continue the registration process
              dispatch({ type: "REGISTER"});
            } else {
              console.log("Registration Failed");
            }
          });
      },
      signOut: () => {
        dispatch({ type: "LOGOUT" });
      },
    };
  }, []);

  // Set the buffer time for the loading screen (only occurs on first opening the app)
  React.useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "RETRIEVE_TOKEN", token: loginState.userToken });
    }, 1000);
  }, []);

  // Show the loading circle while we retrieve whether the users logged in status
  if (loginState.isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}
      >
        <ActivityIndicator size="large" color="#573C6B" />
      </View>
    );
  }
  console.log(loginState);
  return (
    // Use authcontext provider to track the users authentication status across the whole app
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        { /* Transitions to authenticated screen once user data is valid*/}
        {(loginState.userToken != null && loginState.userVerified) ? (
          <LoggedInStack.Navigator screenOptions={{ headerShown: false }}>
            <LoggedInStack.Screen
              name="Authenticated"
              component={AuthenticatedScreen}
            />
          </LoggedInStack.Navigator>
        ) : (
          <UnauthenticatedScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
