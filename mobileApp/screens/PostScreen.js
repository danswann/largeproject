import React from "react";
import { Text, View, StyleSheet,TouchableOpacity, Div} from "react-native";

// COMPONENT BODY
export default function PostScreen({ navigation }) {
  return (
    // Main container
    <View style={styles.container}>

      <Text style={styles.mainText}>What've you been listening to?</Text>

      {/* Spotify button */}
      <TouchableOpacity style={styles.spotifyBtn}>
        <Text style={styles.btnText}>Import a playlist from Spotify</Text>
      </TouchableOpacity>
      
      <Text style={styles.mainText}>or</Text>

      {/* Search button */}
      <TouchableOpacity style={styles.searchBtn}>
        <Text style={styles.btnText}>Search for playlists</Text>
      </TouchableOpacity>
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
