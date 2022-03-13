import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderBackground from "../components/HeaderBackground";
import HeaderTitle from "../components/HeaderTitle";
import HeaderProfile from "../components/HeaderProfile";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import PostScreen from "./PostScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

// Collection of all the screens in the app once the users is authenticated
const AuthenticatedScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#573C6B",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "black", borderTopColor: "gray" },
        tabBarShowLabel: false,
        headerBackground: HeaderBackground,
        headerLeft: HeaderTitle,
        headerRight: HeaderProfile,
        title: "",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AuthenticatedScreen;

const styles = StyleSheet.create({});
