import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ThumbnailBox from "../components/ThumbnailBox";

export default function RowBox(props) {
  return (
    <View style={styles.GridRowContainer}>
      <ThumbnailBox postID={props.row[0].postID} image={props.row[0].image} openPost={props.openPost}/>
      <ThumbnailBox postID={props.row[1].postID} image={props.row[1].image} openPost={props.openPost}/>
      <ThumbnailBox postID={props.row[2].postID} image={props.row[2].image} openPost={props.openPost}/>
    </View>
  );
}

const styles = StyleSheet.create({
  GridRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "flex-start",
    marginVertical: 5,
  },
});
