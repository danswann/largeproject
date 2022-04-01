import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ChatBox(props) {
    return (
        <View style={props.sentByMe ? (styles.rightMessage) : (styles.leftMessage)}>
            {/* <Text style={styles.MainText}>{props.message + " " + props.timeStamp}</Text> */}
            <Text style={props.sentByMe ? (styles.rightText) : (styles.leftText)}>{props.message}</Text>
        </View>

    )
}
const styles = StyleSheet.create({
    leftText: {
        color: "white",
        alignSelf: "center",
        // justifyContent: "center",
        paddingLeft: 10,
    },

    rightText: {
        color: "white",
        alignSelf: "center",
        paddingLeft: 10,
        justifyContent: "space-evenly",
    },

    rightMessage: {
        backgroundColor: "#573C6B",
        flexDirection: "row",
        alignSelf: "flex-end",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        width: "75%",
        height: 25,
        borderColor: "transparent",
    },

    leftMessage: {
        backgroundColor: "gray",
        flexDirection: "row",
        alignSelf: "flex-start",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,        
        width: "75%",
        height: 25,
        borderColor: "transparent",
    },

})