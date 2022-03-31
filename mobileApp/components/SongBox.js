import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, } from "react-native";

// COMPONENT BODY
export default function SongBox(props) {
    return (
        
        <View style={styles.SongContainer}>        
            <View style={{flexDirection: 'row', maxWidth:"60%"}}>
                {/* Song Cover */}
                <Image
                    source={require('../assets/images/testSongCover.jpg')}
                    style={styles.SongCover}
                />
                <View style={{flexDirection: 'column', alignContent: "flex-start", marginStart: 3, marginTop: 5}}>
                    {/* Song Name */}
                    <Text numberOfLines={1} style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>{props.songName}</Text>
                    {/* Song artist */}
                    <Text numberOfLines={1} style={{color: 'white', fontSize: 10, }}>{props.songArtist}</Text>
                </View>
            </View>
            {/* Song Length */}
            <Text style={{color: 'white', textAlign: "right", textAlignVertical:"bottom", marginBottom: 5, marginHorizontal: 5, fontSize: 10}}>{props.songLength}</Text>
        </View>
    );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
    },
    
    SongContainer: {
        backgroundColor: "#573C6B",
        flexDirection: "row",
        justifyContent:"space-between",
        marginVertical: 1,
    },

    SongCover: {
        width: 40,
        height: 40,
        marginVertical: 5,
        marginHorizontal: 5
    },
});