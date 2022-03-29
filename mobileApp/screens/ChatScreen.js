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
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";



const Tab = createMaterialTopTabNavigator();

export default function ChatScreen({ route, navigation }) {
  const { name, messages } = route.params;
  return (
    <View style={styles.MainContainer}>
      <Text>{name}</Text>
      <FlatList
        data= {messages}
        renderItem={({item}) => <ChatBox message={item.message} timeStamp={item.timeStamp} sentByMe={item.sentByMe}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "center",
    backgroundColor: "#23192B",
  },
  
})