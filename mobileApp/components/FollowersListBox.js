import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function FollowersListBox(props) {
  console.log("PROPS: " + props.username);
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.MainText}>{props.username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: "black",
  },
  MainText: {
    color: "white",
  },
});
