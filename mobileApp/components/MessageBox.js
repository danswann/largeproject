import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";


// COMPONENT BODY
export default function MessageBox(props) {
  return (
    <TouchableOpacity 
        style={{minWidth: "100%"}}
        onPress={() => {
            props.navigation.navigate('MessageChat', {name: props.name, messages: props.messages})
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
                        {props.name}
                    </Text>

                    {/* Message */}
                    <View style={{
                        flexDirection: 'row', 
                        alignItems: 'center', }}>
                        <Text style={
                            styles.MainText}>
                            {props.messages[props.messages.length - 1].message}
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
                {props.messages[props.messages.length - 1].timeStamp}
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