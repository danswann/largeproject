import React, {useState, useEffect, useCallback} from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking, FlatList, ActivityIndicator} from "react-native";
import { API_URL } from "../constants/Info";
import PlaylistListBox from "../components/PlaylistListBox";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../Context";

// COMPONENT BODY
export default function PostScreen({ route, navigation }) {

  const [URL, setURL] = useState("")
  const {userID, refreshToken} = route.params
  const [connected, setConnected] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [dropped, setDropped] = useState(false)
  const [loading, setLoading] = useState(true)

  const { refresh } = React.useContext(AuthContext);

  let mounted = true
  const isFocused = useIsFocused();
  useEffect(() => {
    isConnected()
    return function cleanup() { //if user navigates away before an api call is finished, this prevents error
      mounted = false
    }
  }, [isFocused]);

  //Redirect to url button component
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID})
    };
    fetch(`${API_URL}/api/spotify/getAuthLink`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(response.ok)
          if (mounted)
            setURL(response.link)
        else
          console.log(response.error)
      })
  }

  //Gets user connected bool from api
  function isConnected()
  {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID})
    };
    fetch(`${API_URL}/api/user/searchUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
          console.log(response.error)
          return false
        }
        else
          if (mounted)
          {
            setConnected(response.user.spotify.connected)
            setLoading(false)
          }
      })
  }

  //Gets spotify playlists from api
  async function getPlaylists()
  {
    const access = await refresh(userID, refreshToken)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID, accessToken: access})
    };
    fetch(`${API_URL}/api/spotify/getMyPlaylists`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
          console.log(response.error)
        }
        else
          setPlaylists(response.playlists)
        return
      })
  }

  return (
    // Main container
    <View style={styles.container}>
      {(loading ? 
      <View style ={styles.container}>
        {/*Screen is loading*/}
        <ActivityIndicator size="large" color="#573C6B" style={{marginTop: 200}} />
      </View>
      :
      <View style={styles.container}>
        {((!connected) ? 
        (
        <View style={{justifyContent: "flex-start", marginVertical: 50}}>
          <Text style={styles.mainText}>What've you been listening to?</Text>
          <OpenURLButton>Connect your Spotify!</OpenURLButton>
        </View>
        ) 
        :
        (
        <View style={{justifyContent: "flex-start", marginVertical: 50}}>
          {(dropped ? 
          <View style={{width:"80%", height:"80%"}}>
            <TouchableOpacity style={styles.playlistsBtn} onPress={() => {setDropped(false)}}>
              <Text style={styles.btnText}>Back</Text>
            </TouchableOpacity>
            <FlatList
                data={playlists}
                renderItem={({item}) => <PlaylistListBox playlistID={item.id} name={item.name}/>}
                keyExtractor={(item, index) => index.toString()}
              />
          </View>
          :
          <View style={{width:"80%", height:"50%"}}>
            <TouchableOpacity style={styles.playlistsBtn} onPress={() => {[getPlaylists(), setDropped(true)]}}>
              <Text style={styles.btnText}>Pick your playlist!</Text>
            </TouchableOpacity>
          </View>
          )}
        </View>
        )
        )}
      </View>
      )}
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    backgroundColor: "#23192B",
    alignItems: "center",
    justifyContent: "flex-start",
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

  playlistsBtn: {
    height: 50, 
    minWidth: "100%",
    backgroundColor: "#12081A",
    alignItems: "center",
    justifyContent: "center",
  },
});
