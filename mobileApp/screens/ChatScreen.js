import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";

import ChatBox from "../components/ChatBox";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";



const Tab = createMaterialTopTabNavigator();

export default function NotificationScreen() {
  return (
    <View>
        <Text>
            Chat Screen
        </Text>
    </View>
  );
}