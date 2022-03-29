import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProfileBox(props) {
  return (
    // Main container for the profile info
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
        {/* Username */}
        <Text style={styles.UsernameText}>{props.username}</Text>
        {/* Edit profile button */}
        <TouchableOpacity style={styles.EditProfileBtn}>
          <Text style={styles.MainText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.MainText}>This is my bio</Text>
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
  ProfileMainInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 40,
    marginLeft: 40,
  },
  ProfileHeadInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  ProfilePic: {
    height: 75,
    width: 75,
    borderRadius: 75 / 2,
  },
  UsernameText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
  },
  EditProfileBtn: {
    backgroundColor: "#595959",
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    width: 100,
    height: 30,
  },
});
