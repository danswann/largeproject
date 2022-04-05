import React from "react";
import {
  StyleSheet, 
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView, 
  Animated, 
  BackHangler, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableHighlight} from "react-native";

import ChatBox from "../components/ChatBox";
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";


const Tab = createMaterialTopTabNavigator();

export default function ChatScreen({ route, navigation }) {
  const { name, messages } = route.params;  
  return (
    <View style={styles.MainContainer}>
      {/* back button */}
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <View style={{width: 25, height: 25}}>
            <Ionicons style={{ color: "white", marginRight: 5 }} name="chevron-back-outline" size={25} />
          </View>            
        </TouchableOpacity>
      </View>
      
      {/* name on top */}
      <Text style={styles.nameText}>{name}</Text>      
      <FlatList
        data= {messages}
        renderItem={({item}) => <ChatBox message={item.message} timeStamp={item.timeStamp} sentByMe={item.sentByMe}/>}
      />

      {/* message input */}      
      <View style={styles.sendContainer}>
          <TextInput
              style={styles.textInput}
              placeholder="Send a message..."
              placeholderTextColor="white"
              multiline={true}
          />
          <TouchableOpacity onPress={() => {[sendMessage()]}}>
            <View style={{marginHorizontal: 10}}>
              <Ionicons style={styles.sendButton} name="arrow-forward-outline" size={25} color={"white"}/>
            </View>
          </TouchableOpacity>
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
    width: "100%",
    height: "100%",
  },

  nameText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 25,
  },

  sendContainer: {
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "gray",
    width: "95%",
    height: 40,
    marginBottom: 4,
    marginVertical: 5,
    flexDirection: "row",
  },

  textInput: {
    justifyContent: "center",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
    color: "white"
  },

  backButton: {
    paddingLeft: 5,
    paddingTop: 10,
    // backgroundColor: 'white',
    // opacity: 0.25,
  },

  sendButton: {
    justifyContent: "flex-end",
    marginRight: 5,
    marginBottom: 15,
    textAlign: "right"
  },

  buttonText: {
    color: 'white',
  },
  
});