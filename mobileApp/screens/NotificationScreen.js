import {React, useState, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";

import MessageBox from "../components/MessageBox";
import NotificationBox from "../components/NotificationBox";
import ChatScreen from "../screens/ChatScreen";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, StackActions} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { API_URL } from "../constants/Info";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

export default function NotificationScreen({ route, navigation }) {
  const userID = route.params.userID;

  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: { fontSize: 12, color: "white" },
      tabBarIndicatorStyle: {
        backgroundColor: "white",
      },
      tabBarStyle: {
        backgroundColor: "#573C6B",
      },
    }}>
      <Tab.Screen name="Notifications" component={NotificationTab} />
      <Tab.Screen name="Messages" component={MessageTab} navigation={navigation} initialParams={{ userID: userID }}/>
    </Tab.Navigator>
  );
}

function NotificationTab() {
  return (
    <View style={styles.MainContainer}>
    <FlatList
      data={[
        {key: 1, username: 'John Smith', message: 'followed you', timeStamp: '34 min ago'},
        {key: 2, username: 'Arby Jones', message: 'commented on your playlist', timeStamp: '1 hr ago'},
        {key: 3, username: 'Justin Case', message: 'reposted your playlist', timeStamp: '2 days ago'},
        {key: 4, username: 'Black Beard', message: 'liked your playlist', timeStamp: '5 months ago'},
      ]}
      renderItem={({item}) => <NotificationBox username={item.username} message={item.message} timeStamp={item.timeStamp}/>}
    />
  </View>
  );
}

function MessageTab({ route, navigation }) {  
  const myUserID = route.params.userID;
  const [dmList, setdmList] = useState([]);
  const [name, setUsername] = useState("");

  // Gets user data from api
  function getUsername(userID) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID }),
    };
    fetch(`${API_URL}/api/user/searchUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        return response.user.username
      });
  }

  // returns whoever isn't the current user
  function getName(users) {
    if (users[0] === myUserID)
    // need to grab username 
      setUsername(getUsername(users[1]))
  }
  
  // Gets user data from api
  function getdmList()
  {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: myUserID})
    };
    fetch(`${API_URL}/api/directMessage/getAllDMs`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
        if(!response.ok)
        {
        console.log(response.error)
        return
        }
        setdmList(response.dm)
    })
  }  
  
  return (
    <View style={styles.MainContainer}>
      <FlatList
        // data={dmList}
        data={[
          {key: 1, name: 'John Smith', chat: [
            { key: 1, text: 'yo', timeStamp:'3 days ago', sentByMe: false},
            { key: 2, text: 'yooooo', timeStamp:'3 days ago', sentByMe: true},
            { key: 3, text: 'hey nice playlist', timeStamp:'34 min ago', sentByMe: false},
          ]},
          {key: 2, name: 'Arby Jones', chat: [
            { key: 1, text: 'whats your soundcloud', timeStamp: '1 hr ago', sentByMe: true},
          ]},
          {key: 3, name: 'Justin Case', chat: [
            { key: 1, text: 'wanna link sounds?', timeStamp: '2 days ago', sentByMe: false},
          ]},
          {key: 4, name: 'Black Beard', chat: [
            { key: 1, text: 'whats up', timeStamp: '5 months ago', sentByMe: false},
          ]},
        ]}
        // getName(item.users)
        renderItem={({item}) => <MessageBox myUserID={myUserID} name={"doug"} messages={item.chat} navigation={navigation}/>}
      />

      {/* create new message button */}
      {/*  onPress={() => navigation.navigate("Notification")} */}
      <View style={styles.newMessageButton}>
        <TouchableOpacity>
          <View>
            <Ionicons style={{ color: "white", borderStyle: "solid" }} name="create-outline" size={25} />            
          </View>            
        </TouchableOpacity>
      </View>        

    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  MainText: {
    color: "white",
  },

  MessageContainer: {
    backgroundColor: "#23192B",
    flexDirection: "row",
    justifyContent: 'space-between',
    marginStart: 10,
    marginEnd: 10,
    marginTop: 15,
  },

  ProfilePic: {    
    width: 60,
    height: 60,
    borderRadius: 70,
  },

  Button: {
    backgroundColor: "#573c6b",
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
  },

  ButtonText: {
    color: "white",
  },

  newMessageButton: {
    // backgroundColor: "white", 
    // opacity: 0.25, 
    borderRadius: 10, 
    width: 45, 
    height: 45,
    // flexDirection: "row",    
    marginBottom: 10, 
    marginLeft: 325,
    padding: 10,
    justifyContent: "center",
    // alignSelf: "right",
  },

});
