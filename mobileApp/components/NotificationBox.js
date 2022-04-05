import {React, useState, useEffect} from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

// COMPONENT BODY
export default function NotificationBox(props) {
    const [notification, setPlaylistPicture] = useState(false);    

    return (
        
        <View style={styles.NotificationContainer}>        

            <TouchableOpacity style={{flexDirection: 'row'}}>
                {/* profile pic */}
                <Image
                    source={require('../assets/images/defaultSmile.png')}
                    style={styles.ProfilePic}
                /> 
            
                <View style={{flexDirection: 'column', marginStart: 15, marginTop: 5}}>

                    {/* name */}
                    <Text style={{color: 'white', fontWeight: 'bold', textDecorationLine: "underline"}}>{props.username}</Text>
                    
                    {/* Message */}
                    <View style={{flexDirection: 'row', alignItems: 'center', }}>

                        <Text style={styles.MainText}>{props.message}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Timestamp */}
            <Text style={{color: 'white', textAlign: "right", marginTop: 5, marginRight: 10}}>{props.timeStamp}</Text>

            {/* Playlist Image */}
            {(props.message === "followed you" ? <></> : 
            <Image
                source={require('../assets/images/testCover.jpg')}
                style={styles.PostPic}
            />)}
        </View>
        
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
    },
    
    NotificationContainer: {
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

    PostPic: {
        width: 50,
        height: 50,
        marginVertical: 15,
        marginHorizontal: 10,
    },
});