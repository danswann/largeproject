import { NavigationContainer } from "@react-navigation/native";
import {React, useState, useEffect} from "react";
import { 
    Animated, 
    Text, 
    TextInput, 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    FlatList, 
    TouchableWithoutFeedback, 
    ScrollView, 
    ActivityIndicator} from "react-native";

export default function ChatBox(props) {    
    const [tapped, setTapped] = useState(false)
    // get time since message sent
    function getTimeSince(timeStamp)
    {
        let ms = new Date().getTime() - new Date(timeStamp).getTime();
        let days = ms / (1000 * 60 * 60 * 24)
        if(days > 1)
        {
            if(days < 2)
                return "1 day ago"
            return Math.floor(days) + " days ago"
        }
        let hours = days * 24
        if(hours > 1)
        {
            if(hours < 2)
                return "1 hour ago"
            return Math.floor(hours) + " hours ago"
        }
        let minutes = hours * 60
        if(minutes > 1)
        {
            if(minutes < 2)
                return "1 minute ago"
            return Math.floor(minutes) + " minutes ago"
        }
        return "Moments ago"
    }
    
    return (
        <TouchableOpacity onPress={() => setTapped(!tapped)}>
            <View style={props.sentByMe ? (styles.rightMessage) : (styles.leftMessage)}>
                {/* <Text style={styles.MainText}>{props.message + " " + props.timeStamp}</Text> */}
                <Text style={props.sentByMe ? (styles.rightText) : (styles.leftText)}>{props.message}</Text>
            </View>
            {(tapped 
                ? <Text style={props.sentByMe ? ([styles.rightText, {fontSize: 11, alignSelf: "flex-end", marginTop: 5, marginRight: 10}]) : ([styles.leftText, {fontSize: 11, alignSelf: "flex-start", marginTop: 5, marginLeft: 10}])}>{getTimeSince(props.timeStamp)}</Text>
                : <></>
            )}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    leftText: {
        color: "white",
        alignSelf: "center",
        // justifyContent: "center",
        paddingHorizontal: 10,
    },

    rightText: {
        color: "white",
        alignSelf: "center",
        paddingHorizontal: 10,
        justifyContent: "space-evenly",
    },

    rightMessage: {
        backgroundColor: "#573C6B",
        flexDirection: "row",
        alignSelf: "flex-end",
        marginHorizontal: 10,
        marginTop: 15,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 25,
        maxWidth: "70%",
        borderColor: "transparent",
        padding:8,
    },

    leftMessage: {
        backgroundColor: "gray",
        flexDirection: "row",
        alignSelf: "flex-start",
        marginHorizontal: 10,
        marginTop: 15,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 5,        
        maxWidth: "70%",
        borderColor: "transparent",
        padding:8,
    },

})