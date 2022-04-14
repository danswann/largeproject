import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// COMPONENT BODY
export default function NewChatResultBox(props) {
  return (
    <TouchableOpacity
      style={styles.resultContainer}
      onPress={() => {
        props.navigation.navigate({
          name: "OtherProfile",
          params: { userID: props.userID, isFollowed: followed },
        });
      }}
    >
      <View style={styles.infoContainer}>
        {/* profile pic */}
        <Image
          source={
            props.image != undefined
              ? { uri: props.image }
              : require("../assets/images/defaultSmile.png")
          } //default image
          style={styles.ProfilePic}
        />
        <Text numberOfLines={1} style={styles.MainText}>
          {props.username}
        </Text>
      </View>
      {props.myUserID == props.userID ? (
        <></>
      ) : 
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate({
              name: "Chat",
              params: {
                myUserID: props.myUserID,
                otherUserID: props.targetUserID,
                name: props.username,
                newChat: true,
                accessToken: props.accessToken,
              },
            });
          }}
        >
          <Ionicons name="chatbox" color="white" size={20}/>
        </TouchableOpacity>
      }
    </TouchableOpacity>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainText: {
    color: "white",
    width: "80%",
  },
  buttonText: {
    color: "white",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "gray",
    borderRadius: 25,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  resultContainer: {
    backgroundColor: "#12081A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  ProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 70,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
