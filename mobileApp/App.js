import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Ionicons from "react-native-vector-icons/Ionicons";
import AuthenticatedScreen from "./screens/AuthenticatedScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthContext } from "./Context";
import UnauthenticatedScreen from "./screens/UnauthenticatedScreen";

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
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          username: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          username: action.id,
          userToken: action.token,
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
        let userToken;
        userToken = null;
        username = "user";
        password = "pass";
        if (username === "user" && password === "pass") {
          userToken = "usertoken";
        }
        dispatch({ type: "LOGIN", id: username, token: userToken });
      },
      signUp: () => {
        dispatch({ type: "REGISTER", id: "user", token: "usertoken" });
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
        {loginState.userToken ? (
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
