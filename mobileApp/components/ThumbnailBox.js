
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ThumbnailBox(props) {
	return (
		
		<View>
			{(props.postID == 0 ? <></> :
			<TouchableOpacity onPress={() =>{
					props.openPost(props.postID)
				}}>
				<Image
					style={styles.Post}
					source={{
						uri: props.image,
					}}
				/>
			</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	Post: {
		height: 100,
		width: 100,
		marginHorizontal: 5,
	},
});
