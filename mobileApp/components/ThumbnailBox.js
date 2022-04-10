
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ThumbnailBox(props) {
	//use later when post is tapped
	function getPostDataFromID() {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ postID: props.postID })
		};
		fetch(`${API_URL}/api/post/getPost`, requestOptions)
			.then((response) => response.json())
			.then((response) => {
				if (!response.ok) {
					console.log(response.error)
					return
				}
			})
	}
	return (
		
		<View>
			{(props.postID == 0 ? <></> :
			<View>
				<Image
					style={styles.Post}
					source={{
						uri: props.image,
					}}
				/>
			</View>
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
