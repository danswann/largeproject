import React from "react";
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


const Tab = createMaterialTopTabNavigator();

export default function NotificationScreen({ navigation }) {
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
      <Tab.Screen name="Messages" component={MessageTab} navigation={navigation}/>
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

function MessageTab({ navigation}) {
  return (
    <View style={styles.MainContainer}>
      <FlatList
        data={[
          {key: 1, name: 'John Smith', messages: [
            { key: 1, message: 'yo', timeStamp:'3 days ago', sentByMe: false},
            { key: 2, message: 'yooooo', timeStamp:'3 days ago', sentByMe: true},
            { key: 3, message: 'hey nice playlist', timeStamp:'34 min ago', sentByMe: false},
          ]},
          {key: 2, name: 'Arby Jones', messages: [
            { key: 1, message: 'whats your soundcloud', timeStamp: '1 hr ago', sentByMe: true},
          ]},
          {key: 3, name: 'Justin Case', messages: [
            { key: 1, message: 'wanna link sounds?', timeStamp: '2 days ago', sentByMe: false},
          ]},
          {key: 4, name: 'Black Beard', messages: [
            { key: 1, message: 'whats up', timeStamp: '5 months ago', sentByMe: false},
          ]},
        ]}
        renderItem={({item}) => <MessageBox name={item.name} messages={item.messages} navigation={navigation}/>}
      />
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

  tabs: {

  },

});
