import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { API_URL } from "../constants/Info";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../Context";
import { Ionicons } from "@expo/vector-icons";

// COMPONENT BODY
export default function SearchResultBox(props) {
  console.log("isFollowed: ", props.isFollowed);
  const isFocused = useIsFocused();
  const [followed, setFollowed] = useState(props.isFollowed);

  useFocusEffect(
    React.useCallback(() => {
      setFollowed(props.isFollowed);
    }, [props.isFollowed])
  );

  const { refresh } = React.useContext(AuthContext);
  async function followUser() {
    //const access = await refresh(props.myUserID, props.refreshToken)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: props.myUserID,
        followingID: props.userID,
        accessToken: props.accessToken,
      }),
    };
    fetch(`${API_URL}/api/user/followUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          if (isFocused) setFollowed(true);
        } else console.log(response.error);
      });
  }
  async function unfollowUser() {
    const access = await refresh(props.myUserID, props.refreshToken);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: props.myUserID,
        followingID: props.userID,
        accessToken: access,
      }),
    };
    fetch(`${API_URL}/api/user/unfollowUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok)
          if (isFocused) setFollowed(false);
          else console.log(response.error);
      });
  }
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
      ) : !followed ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            followUser();
          }}
        >
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buttonFollowed}
          onPress={() => {
            unfollowUser();
          }}
        >
          <Text style={styles.buttonText}>Unfollow</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: "gray",
            paddingHorizontal: 8,
            paddingVertical: 8,
            marginRight: 20,
          },
        ]}
        onPress={() => {
          props.navigation.navigate({
            name: "Chat",
            params: {
              myUserID: props.myUserID,
              otherUserID: props.userID,
              name: props.username,
              newChat: true,
              accessToken: props.accessToken,
            },
          });
        }}
      >
        <Ionicons name="chatbox" color="white" size={20} />
      </TouchableOpacity>
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
    backgroundColor: "#573C6B",
    borderRadius: 25,
  },
  buttonFollowed: {
    backgroundColor: "#23192B",
    borderRadius: 25,
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
