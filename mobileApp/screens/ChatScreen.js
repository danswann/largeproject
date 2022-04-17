import React, {useState, useEffect, useRef} from "react";
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
import { SOCKET_URL } from "../constants/Info";
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import WebSocket from "ws";
import { withSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

export default function ChatScreen({ route, navigation }) {
  const { myUserID, chatID, otherUserID, newChat, name, messages, accessToken} = route.params;
  const chatIDRef = useRef(chatID)
  const [chatLoading, setChatLoading] = useState();
  const messageInput = useRef("");
  const messageInputRef = useRef();
  const [messageLoading, setMessageLoading] = useState(false);
  const messageArray = useRef(messages)
  const flatListRef = useRef()
  console.log(chatID)

  useEffect(() => {
    setChatLoading(true)
    if(newChat)
      createChat()
    else
      getChat()
  }, [chatID])

  const ws = new WebSocket(`${SOCKET_URL}/api/socket/chat?userID=${myUserID}&chatID=${chatIDRef.current}`, 'chat');
  useEffect(() => {
    //Creates a listener for new messages
    ws.on('message', function message(data) {
      setMessageLoading(true)
      messageArray.current.push(JSON.parse(data))
      setMessageLoading(false)
    });
    //Creates a listener for keyboard opening
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        flatListRef.current.scrollToEnd()
      }
    );

    return () => {
      ws.close()
      keyboardDidShowListener.remove();
    };
  }, []);

  function getChat()
  {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: myUserID, chatID: chatIDRef.current, accessToken: accessToken})
    };
    fetch(`${API_URL}/api/directMessage/getChat`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
        console.log(response.error)
        }
        else{
          messageArray.current = response.dm.chat
          setChatLoading(false)
        }
      })
  }
  function createChat()
  {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({users: [myUserID, otherUserID]})
    };
    console.log()
    fetch(`${API_URL}/api/directMessage/newChat`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
          console.log(response.error)
        }
        else
        {
          chatIDRef.current = response.dm
          getChat()
        }
      })
  }

  function sentByMe(userID) {
    if (userID == myUserID)
      return true
    return false
  }  

  function sendMessage() {
    if (messageInput.current == "")
        return
    setMessageLoading(true)        
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: myUserID, chatID: chatID, text: messageInput.current, accessToken: accessToken})            
    };
    fetch(`${API_URL}/api/directMessage/sendMessage`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      if(!response.ok)
      {
          console.log(response.error)
          setMessageLoading(false)
          return
      }
      else
      {
          messageInput.current = ""
          messageInputRef.current.clear()
          //messageArray.current = response.dm.chat
          flatListRef.current.scrollToEnd()
          setMessageLoading(false)
      }
    })
  }

  function sendLiveMessage()
  {
    setMessageLoading(true)    
    ws.send(JSON.stringify({text: messageInput.current}))
    messageInput.current = ""
    messageInputRef.current.clear()
    flatListRef.current.scrollToEnd()
    setMessageLoading(false)
  }

  return (
    <View style={styles.MainContainer}>

      <View style={{backgroundColor: "#12081A", flexDirection: "row", justifyContent:"space-between"}}>
        {/* back button */}
        <TouchableOpacity onPress={() => [navigation.navigate("Notification")]}>
          <View style={{margin: 15, width: 25, height: 25}}>
            <Ionicons style={{ color: "white", marginRight: 5 }} name="chevron-back-outline" size={25} />
          </View>            
        </TouchableOpacity>
        {/* name on top */}
        <Text style={styles.nameText}>{name}</Text>  
        {/*Spacer*/}
        <View style={{margin: 15, width: 25, height: 25}}/>
      </View>
      
     
      {(chatLoading ? 
      <ActivityIndicator size="large" color="#573C6B" style={{}} />
      :
      <View style={styles.MainContainer}> 
        <FlatList
          ref={flatListRef}
          data= {messageArray.current}
          ListHeaderComponent={<View style={{flexDirection:"row", height:50, marginBottom: 10, width:"50%", alignSelf:"center"}}><Text style={[styles.textInput, {color: "#A57FC1", textAlign: "center", alignSelf: "flex-end", borderBottomColor: "#A57FC1", borderBottomWidth: 1}]}>Start of conversation</Text></View>}
          ListFooterComponent={<View style={{height:30}}/>}
          renderItem={({item}) => <ChatBox message={item.text} timeStamp={item.timeStamp} sentByMe={sentByMe(item.author)}/>}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => (
            {length: 70, offset: 70 * index + 60, index}
          )}
        />
        <View style={{backgroundColor:"#12081A", padding: 5}}>
          {/* message input */}      
          <View style={styles.sendContainer}>
              <TextInput
                ref={messageInputRef}
                style={styles.textInput}
                placeholder="Send a message..."
                placeholderTextColor="#12081A"
                onChangeText={(text) => messageInput.current = text}
                multiline={true}
                clearButtonMode="while-editing"
                selectionColor={"#573C6B"}
              />
              <TouchableOpacity style={{alignSelf:"center"}}onPress={() => {sendLiveMessage()}}>
                <View style={{marginHorizontal: 10}}>
                {(messageLoading ?  <ActivityIndicator size={25} color="#573C6B"/> : <Ionicons name="arrow-forward-outline" size={25} color={"#573C6B"}/>)}  
                </View>
              </TouchableOpacity>
          </View>  
        </View>
      </View>
      )}           
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
    paddingBottom: 12,
    fontSize: 18,
  },

  sendContainer: {
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "white",
    width: "95%",
    marginBottom: 4,
    marginVertical: 5,
    flexDirection: "row",
    
  },

  textInput: {
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    color: "#12081A",
    alignSelf: "center",
    textAlignVertical:"auto",
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