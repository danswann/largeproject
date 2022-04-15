import { NavigationContainer } from "@react-navigation/native";
import {React, useState, useEffect} from "react";
import { useIsFocused } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../constants/Info";

// COMPONENT BODY
export default function MessageBox(props) { 
    const [username, setUsername] = useState("");
    const [image, setImage] = useState("uri");

    const isFocused = useIsFocused();
    useEffect(() => {
        getOtherUsernameAndImage(props.users)
    }, [isFocused]);
    
    // returns whoever isn't the current user
    function getOtherUsernameAndImage(users) {
        if (users[0]._id == props.myUserID)
        {
            setUsername(users[1].username)
            if(users[1].profileImageUrl != undefined)
                setImage(users[1].profileImageUrl)
        }
        else
        {
            setUsername(users[0].username)
            if(users[0].profileImageUrl != undefined)
                setImage(users[0].profileImageUrl)
        }
    }
    
    return (
    <TouchableOpacity 
        style={{minWidth: "100%"}}
        onPress={() => {
            props.navigation.navigate('Chat', {myUserID: props.myUserID, chatID: props.chatID, name: username, newChat: false, accessToken: props.accessToken})
        }}>
        <View style={styles.MessageContainer}>        
            <View style={{flexDirection: 'row'}}>

                {/* profile pic */}
                <Image
                    source={
                        image != "uri"
                            ? { uri: image }
                            : require("../assets/images/defaultSmile.png")
                    }
                    style={styles.ProfilePic}
                />

                <View style={{
                    flexDirection: 'column', 
                    marginStart: 15, 
                    marginTop: 5}}>

                    {/* name */}
                    <Text style={{
                        color: 'white', 
                        fontWeight: 'bold', 
                        textDecorationLine: "underline"}}>
                        {username}
                    </Text>

                    {/* Message */}
                    <View style={{
                        flexDirection: 'row', 
                        alignItems: 'center', }}>
                        <Text style={
                            styles.MainText}>
                            {((props.messages.length != 0) ? props.messages[props.messages.length - 1].text : "")}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Timestamp */}
            <Text style={{
                color: 'white', 
                textAlign: "right", 
                marginTop: 5, 
                marginRight: 10}}>
                {((props.messages.length != 0) ? props.messages[props.messages.length - 1].timestamp : "")}
            </Text>
        </View>
    </TouchableOpacity>
    
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
    },
    
    MessageContainer: {
        backgroundColor: "#12081A",
        flexDirection: "row",
        justifyContent: "space-between",
        marginStart: 10,
        marginEnd: 10,
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
});