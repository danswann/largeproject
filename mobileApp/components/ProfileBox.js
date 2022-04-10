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
          {/* Edit profile button */}
          <TouchableOpacity
            style={styles.EditProfileBtn}
            onPress={() => {
              props.navigation.navigate("EditProfile");
            }}
          >
            <Text style={styles.MainText}>Edit Profile</Text>
          </TouchableOpacity>
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
                params: { userID: props.userID },
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
    backgroundColor: "#595959",
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
  EditProfileBtn: {
    backgroundColor: "#595959",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    width: 100,
    height: 30,
  },
});
