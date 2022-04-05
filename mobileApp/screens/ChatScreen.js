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
  Image} from "react-native";

import ChatBox from "../components/ChatBox";
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";


const Tab = createMaterialTopTabNavigator();

export default function ChatScreen({ route, navigation }) {
  const { name, messages } = route.params;
  // const [fadeAnim] = useState(new Animated.Value(0));
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.MainContainer}>
        {/* back button */}
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")} hitSlop={{top: 100, bottom: 100, left: 8, right: 5}}>
            <Ionicons style={{ color: "white", marginRight: 5 }} name="chevron-back-outline" size={25} />
          </TouchableOpacity>
        </View>
        
        {/* name on top */}
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
    </TouchableWithoutFeedback>

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
  },

  textInput: {
    justifyContent: "center",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
    color: "black"
  },

  backButton: {
    paddingLeft: 5,
    paddingTop: 10,
    // backgroundColor: 'white',
    // opacity: 0.25,
  },

  buttonText: {
    color: 'white',
  },
  
});