import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { API_URL } from "../constants/Info";
import { AuthContext } from "../Context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileBox(props) {

  // Track whether or not you follow this user
  const [isFollowed, setIsFollowed] = useState(props.isFollowed);

  // Follow a user
  async function followUser() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: props.myUserID,
        followingID: props.targetUserID,
        accessToken: props.accessToken,
      }),
    };
    fetch(`${API_URL}/api/user/followUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          setIsFollowed(true);
        } else console.log(response.error);
      });
  }

  // Unfollow a user
  async function unfollowUser() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: props.myUserID,
        followingID: props.targetUserID,
        accessToken: props.accessToken,
      }),
    };
    fetch(`${API_URL}/api/user/unfollowUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          setIsFollowed(false);
        } else console.log(response.error);
      });
  }
  return (
    // Container for all content on page
    <View style={styles.MainContainer}>
      {/* Main container for the profile info */}
      <View style={styles.ProfileMainInfoContainer}>
        {/* Container for username, profile pic, edit profile button */}
        <View style={styles.ProfileHeadInfoContainer}>
          {/* Profile pic */}
          <Image
            style={styles.ProfilePic}
            source={
              props.hasProfileImage
                ? { uri: props.image }
                : require("../assets/images/defaultSmile.png")
            } //default image
          />

          {/* Username and bio (bio length is limited need to fix)*/}
          <View style={styles.UsernameBioContainer}>
            <Text style={styles.UsernameText}>{props.username}</Text>
            <Text style={styles.BioText}>{props.bio}</Text>
          </View>
          {/* Edit profile button or follow button */}
          {props.myUserID === props.targetUserID ? (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: "#573C6B"}]}
              onPress={() => {
                props.navigation.navigate({
                  name: "EditProfile",
                  params: {
                    myUserID: props.myUserID,
                    username: "aaa",
                    bio: "aaa",
                  },
                });
              }}
            >
              <Text style={styles.MainText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            // Follow or unfollow button rendered based on the state of isFollowed
            <View  styles={{flexDirection: "row"}}>
              {isFollowed ? (
                <TouchableOpacity
                  onPress={() => unfollowUser()}
                  style={[styles.button, {backgroundColor: "#23192B"}]}
                >
                  <Text style={styles.MainText}>Unfollow</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => followUser()}
                  style={[styles.button, {backgroundColor: "#573C6B"}]}
                >
                  <Text style={styles.MainText}>Follow</Text>
                </TouchableOpacity>
              )}
              {/* Direct Message button */}
              <TouchableOpacity
                  style={[styles.button, {backgroundColor: "gray"}]}
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
            </View>
          )}
        </View>
        {/* Profile stats */}
        <View style={styles.ProfileStatsContainer}>
          <Text style={styles.ProfileStatsText}>
            {props.postCount + "\nPosts"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate({
                name: "FollowersList",
                params: {
                  userID: props.targetUserID,
                  myUserID: props.myUserID,
                },
              });
            }}
          >
            <Text style={styles.ProfileStatsText}>
              {props.followerCount + "\nFollowers"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate({
                name: "FollowingList",
                params: {
                  userID: props.targetUserID,
                  myUserID: props.myUserID,
                },
              });
            }}
          >
            <Text style={styles.ProfileStatsText}>
              {props.followingCount + "\nFollowing"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  MainContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  ProfileMainInfoContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    padding: 20,
  },
  ProfileHeadInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  UsernameBioContainer: {
    flexDirection: "column",
    maxWidth: 155,
    maxHeight: 60,
    marginLeft: 10,
  },
  ProfileStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#573C6B",
    alignSelf: "stretch",
    borderRadius: 10,
    padding: 5,
    marginTop: 15,
  },
  ProfileStatsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  ProfilePic: {
    height: 75,
    width: 75,
    borderRadius: 75 / 2,
  },
  UsernameText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
  },
  BioText: {
    color: "white",
    marginLeft: 2,
    marginTop: 10,
    textAlign: "left",
    fontSize: 12,
    alignSelf: "flex-start",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
});
