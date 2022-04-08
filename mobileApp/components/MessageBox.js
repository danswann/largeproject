import { NavigationContainer } from "@react-navigation/native";
import {React, useState, useEffect} from "react";
import { useIsFocused } from "@react-navigation/native";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { API_URL } from "../constants/Info";


// COMPONENT BODY
export default function MessageBox(props) {   
    const [username, setUsername] = useState("");

    const isFocused = useIsFocused();
    useEffect(() => {
        getOtherUsername(props.users)
    }, [isFocused]);

    // Gets user data from api
    function getUsername(userID) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: userID }),
        };
        fetch(`${API_URL}/api/user/searchUser`, requestOptions)
          .then((response) => response.json())
          .then((response) => {
            if (!response.ok) {
              console.log(response.error);
              return;
            }
            setUsername(response.user.username)
          });
      }
    
    // returns whoever isn't the current user
    function getOtherUsername(users) {
        if (users[0] == props.myUserID)
            getUsername(users[1])
        else
            getUsername(users[0])
    }
    
    return (
    <TouchableOpacity 
        style={{minWidth: "100%"}}
        onPress={() => {
            props.navigation.navigate('Chat', {myUserID: props.myUserID, name: username, messages: props.messages})
        }}>
        <View style={styles.MessageContainer}>        
            <View style={{flexDirection: 'row'}}>

                {/* profile pic */}
                <Image
                    source={require('../assets/images/defaultSmile.png')}
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
        backgroundColor: "#573C6B",
        flexDirection: "row",
        justifyContent: "space-between",
        marginStart: 10,
        marginEnd: 10,
        marginTop: 15,
    },

    ProfilePic: {
        width: 60,
        height: 60,
        borderRadius: 70,
        marginVertical: 10,
        marginHorizontal: 10
    },
});