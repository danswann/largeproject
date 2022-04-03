import {React, useState, useEffect, useCallback} from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking,} from "react-native";
import { API_URL } from "../constants/Info";

// COMPONENT BODY
export default function PostScreen({}) {

  const [URL, setURL] = useState("")


  const OpenURLButton = ({children}) => {
    authSpotify()
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(URL);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(URL);
      } else {
        console.log("Don't know how to open this URL: " + {URL});
      }
    }, [URL]);
  
    return (
    <TouchableOpacity style={styles.spotifyBtn} onPress={handlePress}>
        <Text style={styles.mainText}>{children}</Text>
    </TouchableOpacity> 
    );
  };

  function authSpotify() {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`${API_URL}/api/spotify/getAuthLink`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(response.ok)
          setURL(response.link)
        else
          console.log(response.error)
      })
  }
  return (
    // Main container
    <View style={styles.container}>

      <Text style={styles.mainText}>What've you been listening to?</Text>
      {/* Spotify button */}
      <OpenURLButton>Connect your Spotify!</OpenURLButton>

    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23192B",
    alignItems: "center",
    justifyContent: "center",
  },

  mainText: {
    fontSize: 15,
    color: "white",
  },

  btnText: {
    fontSize: 13,
    color: "white",
  },

  spotifyBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#573C6B",
  },

  searchBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#573C6B",
  }
});
