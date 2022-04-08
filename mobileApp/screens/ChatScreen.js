import {React, useState, useEffect} from "react";
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
import { API_URL } from "../constants/Info";
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";


const Tab = createMaterialTopTabNavigator();

export default function ChatScreen({ route, navigation }) {
  const { myUserID, name, messages } = route.params;  
  const [messageInput, setMessageInput] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageArray, setMessageArray] = useState(messages)
  function sentByMe(userID) {
    if (userID === myUserID)
      return true
    return false
  }  

  function updateChat(messages) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({dmID: messages.postID})
    };
    fetch(`${API_URL}/api/directMessage/getDM`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      if(!response.ok)
      {
      console.log(response.error)
      return
      }
      setMessageArray(response.dm)
    })
  }

  function sendMessage() {
    if (messageInput == "")
        return
    setMessageLoading(true)        
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id: messageArray.postID, text: messageInput, userID: myUserID})            
    };
    fetch('${API_URL}/api/directMessage/sendMessage', requestOptions)
    .then((response) => response.json())
    .then((response) => {
        if(!response.ok)
        {
            console.log(response.error)
            return
        }
        else
        {
            setMessageInput("")
            updateChat()
            setMessageLoading(false)
        }
    })
}

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
        data= {messageArray}
        // sentByMe(item.userID)
        renderItem={({item}) => <ChatBox message={item.text} timeStamp={item.timeStamp} sentByMe={sentByMe(item.userID)}/>}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* message input */}      
      <View style={styles.sendContainer}>
          <TextInput
            value={messageInput}
            style={styles.textInput}
            placeholder="Send a message..."
            placeholderTextColor="white"
            onChangeText={(text) => setMessageInput(text)}
            multiline={true}
          />
          <TouchableOpacity onPress={() => {[sendMessage()]}}>
            <View style={{marginHorizontal: 10}}>
            {(messageLoading ?  <ActivityIndicator size={25} color="#12081A"/> : <Ionicons name="arrow-forward-outline" size={25} color={"#12081A"}/>)}  
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