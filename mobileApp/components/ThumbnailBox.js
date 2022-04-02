
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ThumbnailBox(props) {
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
						uri: "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg",
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
