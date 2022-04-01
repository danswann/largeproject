
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ThumbnailBox from "../components/ThumbnailBox";

export default function RowBox(props) {
	return (
		<View style={styles.GridRowContainer}>
        <ThumbnailBox post={props.row[0].postID}/>
        <ThumbnailBox post={props.row[1].postID}/>
        <ThumbnailBox post={props.row[2].postID}/>
		</View>
	);
}

const styles = StyleSheet.create({
  GridRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
    marginVertical: 5,
  },
});
