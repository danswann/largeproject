import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";


const Tab = createMaterialTopTabNavigator();



function MessagesList() {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => <MessageTab data={item} />}
    />
  );
}

export default function NotificationScreen() {
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
      <Tab.Screen name="Messages" component={MessageTab} />
    </Tab.Navigator>
  );
}

function NotificationTab() {
  return (
    <View style={styles.MainContainer}>
      <Text style={
        styles.MainText}
        >View Your Notifications!</Text>
    </View>
  );
}

function MessageTab() {
  return (
    <View style={styles.MainContainer}>
      <TouchableOpacity>
        <View style={styles.MessageContainer}>        
          <View style={{flexDirection: 'row'}}>

            {/* profile pic */}
            <Image
              source={require('../assets/images/defaultSmile.png')}
              style={styles.ProfilePic}
            />

            {/* name */}
            <View style={{flexDirection: 'column', marginStart: 15}}>

              <Text style={{
                color: 'white', 
                fontWeight: 'bold', 
                textDecoration: "underline"}}>
                John Smith</Text>

              {/* Message */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>

                <Text 
                style={styles.MainText}>
                hey nice playlist</Text>

              </View>
            </View>
          </View>

          {/* Timestamp */}
          <Text style={{
            color: 'white', 
            textAlign: "right"}}>
            2h ago</Text>

        </View>
      </TouchableOpacity>
    </View>
    
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
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
