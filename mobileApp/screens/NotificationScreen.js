import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// COMPONENT BODY
const NotificationScreen = () => {
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.MainText}>View Your Notifications!</Text>

      <TouchableOpacity style={styles.Button} onPress={() => { alert("Here are your notifications"); }}>
        <Text style={styles.ButtonText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.Button} onPress={() => { alert("Here are your messages"); }}>
        <Text style={styles.ButtonText}>Messages</Text>
      </TouchableOpacity>
    </View>
  );  
};

export default NotificationScreen;

// COMPONENT STYLES
const styles = StyleSheet.create({

  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },

  MainText: {
    color: "white",
  },

  Button: {
    backgroundColor: '#573c6b',
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    display: "inline-block",    
  },

  ButtonText: {
    color: "white",
  },

});
