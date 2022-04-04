import { NavigationContainer } from "@react-navigation/native";
import {React, useState, useEffect} from "react";
import { API_URL } from "../constants/Info";
import { Text, View, StyleSheet, Image, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


// COMPONENT BODY
export default function PlaylistListBox(props) {
  return (
    <TouchableOpacity style={styles.resultContainer} 
    onPress={() => {
      //get playlist info and fill out post information
    }}>
      {/* playlist pic */}
      <Image
            source={require('../assets/images/testCover.jpg')}
            style={styles.playlistPic}
      />
      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.MainText}>{props.name}</Text>
        <Text numberOfLines={1} style={styles.SubText}>{"This playlist is private (not accurate yet)"}</Text>
      </View>
      <Ionicons name="add" size={25} color={"white"}/>
    </TouchableOpacity>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
      color: "white",
      width: "80%"
    },
    SubText: {
      color: "#A57FC1",
      fontSize: 8,
      width: "80%"
    },
    buttonText: {
      color: "white",
      marginHorizontal: 20,
      marginVertical: 10,
    },
    button: {
      backgroundColor: "#573C6B",
      borderRadius: 25,
      marginHorizontal: 20,
    },
    infoContainer: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "67%"
    },
    resultContainer: {
      backgroundColor: "#12081A",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 2
    },
    playlistPic: {
      width: 40,
      height: 40,
      marginVertical: 10,
      marginHorizontal: 10
    },
});