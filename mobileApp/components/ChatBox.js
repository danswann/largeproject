import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ChatBox(props) {
    return (
        <View style={props.sentByMe ? (styles.rightMessage) : (styles.leftMessage)}>
            <Text>{props.message + " " + props.timeStamp}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    rightMessage: {
        backgroundColor: "#573C6B",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
    },

    leftMessage: {
        backgroundColor: "#573C6B",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
    },

})