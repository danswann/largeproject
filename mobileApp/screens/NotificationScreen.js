import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-elements";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Tab = createMaterialTopTabNavigator();

function NotificationScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

// // COMPONENT BODY
// const NotificationScreen = () => {
//   return (
//     <View style={styles.MainContainer}>
//       <Text style={styles.MainText}>View Your Notifications!</Text>

//       <TouchableOpacity style={styles.Button} onPress={() => { alert("Here are your notifications"); }}>
//         <Text style={styles.ButtonText}>Notifications</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.Button} onPress={() => { alert("Here are your messages"); }}>
//         <Text style={styles.ButtonText}>Messages</Text>
//       </TouchableOpacity>
//     </View>
//   );  
// };

export default NotificationScreen;

// COMPONENT STYLES
const styles = StyleSheet.create({

  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: 'black',
  },

  MainText: {
    color: "white",
  },

  Button: {
    backgroundColor: '#573c6b',
    borderRadius: 5,
    padding: 5,
    alignItems: "center",   
  },

  ButtonText: {
    color: "white",
  },

  box: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },


});
