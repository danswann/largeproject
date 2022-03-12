import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

function NotificationScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}>
      <Text style={{ color: "white" }}>View Your Notifications!</Text>
    </View>
  );
}

function MessagesScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}>
      <Text style={{ color: "white" }}>View Your Messages!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Messages") {
              iconName = focused ? "messages" : "messages-outline";
            } else if (route.name === "Notification") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Profile")
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#573C6B",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "black", borderTopColor: "gray" },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Notification" component={NotificationScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}