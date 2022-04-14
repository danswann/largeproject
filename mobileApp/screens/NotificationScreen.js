import {React, useState, useEffect} from "react";
import { useIsFocused, useLinkProps } from "@react-navigation/native";
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
  const {userID, accessToken, refreshToken} = route.params;

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
      <Tab.Screen name="Messages" component={MessageTab} navigation={navigation} initialParams={{ myUserID: userID , accessToken: accessToken, refreshToken: refreshToken }}/>
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
  const {myUserID, accessToken, refreshToken} = route.params;
  const [dmList, setdmList] = useState([]);  

  const isFocused = useIsFocused();
  useEffect(() => {
    getdmList()
  }, [isFocused]);

  // Gets user data from api
  function getdmList()
  {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: myUserID, accessToken: accessToken})
    };
    fetch(`${API_URL}/api/directMessage/getAllChats`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
        console.log(response.error)
        }
        setdmList(response.dm)
      })
  }  
  
  return (
    <View style={styles.MainContainer}>
      <FlatList
        data={dmList} 
        renderItem={({item}) => <MessageBox myUserID={myUserID} chatID={item._id} users={item.users} messages={item.chat} accessToken={accessToken} navigation={navigation}/>}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* create new message button */}
      {/*  onPress={() => navigation.navigate("Notification")} */}
      <View style={styles.newMessageButton}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NewChat");            
          }}>
          <View style= {{backgroundColor:"#573C6B", width: 54, height: 54, borderRadius:27, justifyContent: "center", alignItems: "center"}}>
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
    alignSelf: "flex-end",
    marginEnd: 20,
    marginBottom: 20,
  },

});
