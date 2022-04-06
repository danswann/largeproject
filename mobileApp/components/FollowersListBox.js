import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

export default function FollowersListBox(props) {
  console.log("PROPS: " + props.username);
  return (
    <View style={styles.MainContainer}>
      {/* Profile pic and username container */}
      <View style={styles.infoContainer}>
        <Image
          source={require("../assets/images/defaultSmile.png")}
          style={styles.ProfilePic}
        />
        <Text style={styles.MainText}>{props.username}</Text>
      </View>
      <TouchableOpacity style={styles.FollowButton}>
        <Text style={styles.FollowButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: "#12081A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  MainText: {
    color: "white",
  },
  FollowButton: {
    alignSelf: "flex-end",
    backgroundColor: "#573C6B",
    borderRadius: 25,
    marginHorizontal: 20,
  },
  FollowButtonText: {
    color: "white",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  ProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 70,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
