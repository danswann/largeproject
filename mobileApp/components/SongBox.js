import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, } from "react-native";


//Prevents re-rendering when data is the same
export default React.memo(SongBox, areEqual)

const areEqual = (prevProps, nextProps) => {
  if (nextProps.songID == prevProps.songID)
    return true;
  else
    return false;
}

// COMPONENT BODY
function SongBox(props) {
    function getSongLength()
    {
        const seconds = (props.songLength / 1000)
        const remainingSeconds = Math.floor(seconds % 60)
        const minutes = Math.floor(seconds / 60)
        let secondsString = remainingSeconds
        if(remainingSeconds < 10)
           secondsString = "0" + remainingSeconds
        return (minutes + ":" + secondsString)
    }
    function buildArtistString(artists)
    {
        let string = "";
        string = string.concat(artists[0])
        for(let i = 1; i < artists.length; i++)
            string = string.concat(", " + artists[i])
        return string
    }
    return (
        
        <View style={[styles.SongContainer]}>        
            <View style={{flexDirection: 'row', maxWidth:"60%"}}>
                {/* Song Cover */}
                <Image
                    source={{uri: props.songCover}}
                    style={styles.SongCover}
                />
                <View style={{flexDirection: 'column', alignContent: "flex-start", marginStart: 3, marginTop: 5}}>
                    {/* Song Name */}
                    <Text numberOfLines={1} style={{color: 'white', fontWeight: 'bold', fontSize: 11}}>{props.songName}</Text>
                    {/* Song artist */}
                    <Text numberOfLines={1} style={{color: 'white', fontSize: 10, }}>{buildArtistString(props.songArtists)}</Text>
                </View>
            </View>
            {/* Song Length */}
            <Text style={{color: 'white', textAlign: "right", textAlignVertical:"bottom", marginBottom: 5, marginHorizontal: 5, fontSize: 10}}>{getSongLength()}</Text>
        </View>
    );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
    },
    
    SongContainer: {
        borderColor: "#573C6B",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent:"space-between",
        marginVertical: -0.5,
    },

    SongCover: {
        width: 40,
        height: 40,
        marginVertical: 5,
        marginHorizontal: 5
    },
});