import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthenticatedScreen from "./screens/AuthenticatedScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Variable to maintain state of user authentication
const isLoggedIn = true;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Checks if user is authenticated, if so we show the authenticated screen which is our main app screen */}
        {isLoggedIn ? (
          <Stack.Group>
            <Stack.Screen
              name="Authenticated"
              component={AuthenticatedScreen}
            />
          </Stack.Group>
        ) : (
          // If user is not authenticated then we show the unauthenticated screen which is composed of the login/register screen
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
