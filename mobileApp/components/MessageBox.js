import { NavigationContainer } from "@react-navigation/native";
import {React, useState, useEffect, useRef} from "react";
import { useIsFocused } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../constants/Info";

// COMPONENT BODY
export default function MessageBox(props) { 
    const username = useRef("");
    const image = useRef("uri");
    const [loading, setLoading] = useState(true)

    const isFocused = useIsFocused();
    useEffect(() => {
        setLoading(true)
        image.current = "uri"
        username.current = ""
        getOtherUsernameAndImage(props.users)
        console.log(username.current)
        setLoading(false)
    }, [isFocused, props.chatID]);
    
    // returns whoever isn't the current user
    function getOtherUsernameAndImage(users) {
        if (users[0]._id == props.myUserID)
        {
            username.current = users[1]?.username
            if(users[1]?.profileImageUrl != undefined)
                image.current = users[1]?.profileImageUrl
        }
        else
        {
            username.current = users[0]?.username
            if(users[0]?.profileImageUrl != undefined)
                image.current = users[0]?.profileImageUrl
        }
    }
    
    return (
    <TouchableOpacity 
        style={{minWidth: "100%", maxWidth:"100%"}}
        onPress={() => {
            props.navigation.navigate('Chat', {myUserID: props.myUserID, chatID: props.chatID, name: username.current, newChat: false, accessToken: props.accessToken})
        }}>
        <View style={styles.MessageContainer}>        
            <View style={{flexDirection: 'row'}}>

                {/* profile pic */}
                <Image
                    source={
                        image.current != "uri"
                            ? { uri: image.current }
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
                        {username.current}
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
        width:"85%",
        marginBottom: 5,
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