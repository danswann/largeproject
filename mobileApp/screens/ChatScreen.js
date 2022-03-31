import React from "react";
import {StyleSheet, BackHangler, Text, TextInput, View, TouchableOpacity, FlatList, Image} from "react-native";

import ChatBox from "../components/ChatBox";
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";



const Tab = createMaterialTopTabNavigator();

export default function ChatScreen({ route, navigation }) {
  const { name, messages } = route.params;
  return (
    <View style={styles.MainContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Notification")}>
          <Text>back</Text>
      </TouchableOpacity>
      <Text style={styles.nameText}>{name}</Text>      
      <FlatList
        data= {messages}
        renderItem={({item}) => <ChatBox message={item.message} timeStamp={item.timeStamp} sentByMe={item.sentByMe}/>}
      />
      <View style={styles.sendContainer}>
          <TextInput
              style={styles.textInput}
              placeholder="Send a message..."
              placeholderTextColor="white"
          />
      </View>      
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

  nameText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 25,
  },

  sendContainer: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "gray",
    width: "90%",
    height: 40,
    marginBottom: 5,
    marginVertical: 5,
  },

  textInput: {
    justifyContent: "center",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
    color: "black"
  }
  
});