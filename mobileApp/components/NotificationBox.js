import {React, useState, useEffect} from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

// COMPONENT BODY
export default function NotificationBox(props) {
    function convertTypeToMessage(type)
    {
        switch(type){
            // 0 - sender followed user
            case 0: return "followed you"
            // 1 - sender liked users post
            case 1: return "liked your post"
            // 2 - sender reposted users post
            case 2: return "reposted your post"
            // 3 - sender commented on users post
            case 3: return "commented on your post"
        }
    }
    //get time since posted
    function getTimeSince(timeStamp) {
        let ms = new Date().getTime() - new Date(timeStamp).getTime();
        let days = ms / (1000 * 60 * 60 * 24);
        if (days > 1) {
        if (days < 2) return "1 day ago";
        return Math.floor(days) + " days ago";
        }
        let hours = days * 24;
        if (hours > 1) {
        if (hours < 2) return "1 hour ago";
        return Math.floor(hours) + " hours ago";
        }
        let minutes = hours * 60;
        if (minutes > 1) {
        if (minutes < 2) return "1 minute ago";
        return Math.floor(minutes) + " minutes ago";
        }
        return "A few moments ago";
    }

    return (
    <TouchableOpacity 
        style={{width: "100%"}}
        onPress={() => {
            props.openPost(props.postID)
    }}>
        <View style={styles.NotificationContainer}>
            <TouchableOpacity style={{flexDirection: 'row'}}
                onPress={() => {
                    props.navigation.navigate({
                        name: "OtherProfile",
                        params: { userID: props.senderID },
                      });
                }}
            >
                {/* profile pic */}
                <Image
                    source={
                        props.image != undefined
                            ? { uri: props.image }
                            : require("../assets/images/defaultSmile.png")
                    }
                    style={styles.ProfilePic}
                /> 
            
                <View style={{flexDirection: 'column', marginStart: 15, marginTop: 5, minWidth:"40%", maxWidth:"60%"}}>

                    {/* name */}
                    <Text style={{color: 'white', fontWeight: 'bold', textDecorationLine: "underline"}}>{props.username}</Text>
                    
                    {/* Message */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                        <Text style={styles.MainText}>{convertTypeToMessage(props.notificationType)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{justifyContent: "flex-end"}}>
                {/* Playlist Image */}
                {(props.notificationType == 0 ? <></> : 
                <Image
                    source={{uri: props.postImage}}
                    style={styles.PostPic}
                />)}

                {/* Timestamp */}
                <Text style={{color: 'white', textAlign: "right", marginBottom: 5, marginTop: 5, marginRight: 10}}>{getTimeSince(props.timeStamp)}</Text>
            </View>
        </View> 
    </TouchableOpacity>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
    },
    
    NotificationContainer: {
        backgroundColor: "#12081A",
        flexDirection: "row",
        justifyContent: "space-between",
        minWidth: "95%",
        maxWidth: "95%",
        marginHorizontal:10,
        marginTop: 10,
        borderRadius: 10,
        
    },

    ProfilePic: {
        width: 60,
        height: 60,
        borderRadius: 70,
        marginVertical: 10,
        marginHorizontal: 10
    },

    PostPic: {
        width: 40,
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,
        alignSelf:"flex-end"
    },
});