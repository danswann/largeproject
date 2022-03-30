import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProfileBox(props) {
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
            source={{
              uri: "https://media.comicbook.com/2020/10/my-hero-academia-bakugo-1240308.jpeg?auto=webp",
            }}
          />

          {/* Username and bio (bio length is limited need to fix)*/}
          <View style={styles.UsernameBioContainer}>
            <Text style={styles.UsernameText}>{props.username}</Text>
            <Text style={styles.BioText}>{props.bio}</Text>
          </View>
          {/* Edit profile button */}
          <TouchableOpacity style={styles.EditProfileBtn}>
            <Text style={styles.MainText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        {/* Profile stats */}
        <View style={styles.ProfileStatsContainer}>
          <Text style={styles.ProfileStatsText}>
            {props.postCount + "\nPosts"}
          </Text>
          <Text style={styles.ProfileStatsText}>
            {props.followerCount + "\nFollowers"}
          </Text>
          <Text style={styles.ProfileStatsText}>
            {props.followingCount + "\nFollowing"}
          </Text>
        </View>
      </View>
      {/* Container for nav */}
      <View style={styles.NavContainer}>
        <Ionicons name="grid" size={20} color="white" />
        <Ionicons name="heart" size={20} color="white" />
      </View>
      {/* Grid container */}
      <View style={styles.GridColumnContainer}>
        <View style={styles.GridRowContainer}>
          <Image
            style={styles.Post}
            source={{
              uri: "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg",
            }}
          />
          <Image
            style={styles.Post}
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/en/3/35/The_Eminem_Show.jpg",
            }}
          />
          <Image
            style={styles.Post}
            source={{
              uri: "https://m.media-amazon.com/images/I/81iSM6Nk0EL._SL1469_.jpg",
            }}
          />
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
    backgroundColor: "#595959",
    alignSelf: "stretch",
    borderRadius: 10,
    padding: 5,
    marginTop: 15,
  },
  NavContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
    marginTop: 10,
  },
  GridColumnContainer: {
    marginTop: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
  },
  GridRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch"
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
  EditProfileBtn: {
    backgroundColor: "#595959",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    width: 100,
    height: 30,
  },
  Post: {
    height: 100,
    width: 100,
  },
});
