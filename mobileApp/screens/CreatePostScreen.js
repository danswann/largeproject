import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TextInput,
  AppState,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { API_URL } from "../constants/Info";
import PlaylistListBox from "../components/PlaylistListBox";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../Context";
import SongBox from "../components/SongBox";

// COMPONENT BODY
export default function PostScreen({ route, navigation }) {
  const [URL, setURL] = useState("");
  const { userID, accessToken, refreshToken } = route.params;
  const [connected, setConnected] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [dropped, setDropped] = useState(false);
  const [loading, setLoading] = useState(true);

  const [caption, setCaption] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistImage, setPlaylistImage] = useState("uri");
  const [playlistID, setPlaylistID] = useState(0);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [playlistIsPublic, setPlaylistIsPublic] = useState(true);

  const { refresh } = React.useContext(AuthContext);

  const isFocused = useIsFocused();
  //Activates when user re-enters app (on CreatePostScreen) to update connected
  useEffect(() => {
    const listener = (nextAppState) => {
      console.log("User entering " + nextAppState);
      if (nextAppState === "active") isConnected();
    };
    if (!connected && isFocused) AppState.addEventListener("change", listener);
    isConnected();
    return () => {
      AppState.removeEventListener("change", listener);
    };
  }, [connected, isFocused]);

  //Redirect to url button component
  const OpenURLButton = ({ children }) => {
    authSpotify();
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(URL);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(URL);
      } else {
        console.log("Don't know how to open this URL: " + { URL });
      }
    }, [URL]);

    return (
      <TouchableOpacity style={styles.spotifyBtn} onPress={handlePress}>
        <Text style={styles.btnText}>{children}</Text>
      </TouchableOpacity>
    );
  };

  function authSpotify() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID }),
    };
    fetch(`${API_URL}/api/spotify/getAuthLink`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) setURL(response.link);
        else console.log(response.error);
      });
  }

  //Gets user connected bool from api
  function isConnected() {
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
        } else setConnected(response.user.spotify.connected);
        setLoading(false);
      });
  }

  //Gets spotify playlists from api
  async function getPlaylists() {
    //const access = await refresh(userID, refreshToken)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID, accessToken: accessToken }),
    };
    fetch(`${API_URL}/api/spotify/getMyPlaylists`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
        } else setPlaylists(response.playlists);
        return;
      });
  }
  function getSongsFromID(playlistID) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID, playlistID: playlistID }),
    };
    fetch(`${API_URL}/api/spotify/getPlaylistData`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        setPlaylistSongs(response.playlist.tracks);
      });
  }

  const makePostFromPlaylist = (playlist) => {
    setDropped(false);
    setPlaylistIsPublic(playlist.public);
    setPlaylistID(playlist.id);
    getSongsFromID(playlist.id);
    setPlaylistTitle(playlist.name);
    setPlaylistImage(playlist.image);
  };

  function clearScreen() {
    setDropped(false);
    setCaption("");
    setPlaylistIsPublic(false);
    setPlaylistID(0);
    setPlaylistSongs([]);
    setPlaylistTitle("");
    setPlaylistImage("uri");
  }

  function createPost() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
        playlistID: playlistID,
        caption: caption,
        accessToken: accessToken,
      }),
    };
    fetch(`${API_URL}/api/post/newPost`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        clearScreen();
        navigation.navigate({ name: "Home", params: { reload: true } });
      });
  }

  return (
    // Main container
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {loading ? (
          <View>
            {/*Screen is loading*/}
            <ActivityIndicator
              size="large"
              color="#573C6B"
              style={{ marginTop: 200 }}
            />
          </View>
        ) : (
          <View>
            {playlistTitle == "" && !dropped ? (
              <View style={{ alignItems: "center", marginTop: 100 }}>
                {/* <Image
                source={require("../assets/images/defaultSmile.png")} //make this something more relevant
                style={{ height: 100, width: 100 }}
              /> */}
                <Text style={styles.mainText}>
                  What've you been listening to?
                </Text>
              </View>
            ) : (
              <></>
            )}
            {!connected ? (
              <View style={{ alignItems: "center" }}>
                <OpenURLButton>Connect your Spotify!</OpenURLButton>
              </View>
            ) : (
              <View style={{ alignItems: "center", marginTop: 10 }}>
                {dropped ? (
                  <View
                    onStartShouldSetResponder={() => true}
                    style={{ width: "90%", height: "80%", marginTop: 10 }}
                  >
                    <TouchableOpacity
                      style={styles.playlistsBtn}
                      onPress={() => {
                        [setDropped(false), setPlaylistTitle("")];
                      }}
                    >
                      <Text style={styles.btnText}>Back</Text>
                    </TouchableOpacity>
                    <FlatList
                      data={playlists}
                      renderItem={({ item }) => (
                        <PlaylistListBox
                          playlist={item}
                          image={item.image}
                          name={item.name}
                          public={item.public}
                          pick={makePostFromPlaylist}
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                ) : playlistTitle == "" ? (
                  <View style={{ width: "90%" }}>
                    <TouchableOpacity
                      style={styles.playlistsBtn}
                      onPress={() => {
                        [getPlaylists(), setDropped(true)];
                      }}
                    >
                      <Text style={styles.btnText}>Pick your playlist!</Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.btnText,
                        { marginTop: 15, textAlign: "center" },
                      ]}
                    >
                      Make sure you playlist is public, or it will not be
                      available to post.
                    </Text>
                  </View>
                ) : (
                  <View style={{ width: "90%" }}>
                    <TouchableOpacity
                      style={styles.playlistBtnExpanded}
                      onPress={() => {
                        [getPlaylists(), setDropped(true)];
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: playlistImage }}
                          style={styles.playlistPicBig}
                        />
                      </View>
                      <View
                        style={{ justifyContent: "flex-end", marginTop: 10 }}
                      >
                        <Text
                          style={{
                            color: "white",
                            textDecorationLine: "underline",
                            fontWeight: "bold",
                            fontSize: 25,
                          }}
                        >
                          {playlistTitle}
                        </Text>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ color: "white", fontSize: 12 }}>
                            {playlistSongs.length > 0
                              ? playlistSongs.length + " songs"
                              : ""}
                          </Text>
                          <Text style={{ color: "#A57FC1", fontSize: 12 }}>
                            {playlistIsPublic
                              ? "Public"
                              : "Private, viewers won't be able to listen to your songs."}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {playlistTitle == "" || dropped ? (
                  <></>
                ) : (
                  <View style={{ width: "100%", alignItems: "center" }}>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.TextInput}
                        placeholder="Enter a caption for this post..."
                        placeholderTextColor="white"
                        selectionColor={"#573C6B"}
                        multiline={true}
                        value={caption}
                        onChangeText={(text) => setCaption(text)}
                      />
                    </View>
                    <View
                      onStartShouldSetResponder={() => true}
                      style={{
                        maxHeight: "50%",
                        width: "100%",
                        marginVertical: 10,
                      }}
                    >
                      <FlatList
                        style={styles.SongList}
                        data={playlistSongs}
                        renderItem={({ item }) => (
                          <SongBox
                            songCover={item.image}
                            songName={item.name}
                            songArtists={item.artists}
                            songLength={item.duration}
                          />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.spotifyBtn}
                      onPress={() => {
                        createPost();
                      }}
                    >
                      <Text style={styles.btnText}>Create Post!</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "#23192B",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  mainText: {
    fontSize: 15,
    marginVertical: 10,
    color: "white",
  },

  btnText: {
    fontSize: 15,
    marginHorizontal: 10,
    color: "white",
    textAlign: "center",
  },

  spotifyBtn: {
    width: "90%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#573C6B",
    paddingHorizontal: 5,
  },

  playlistsBtn: {
    height: 50,
    minWidth: "100%",
    backgroundColor: "#12081A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  playlistBtnExpanded: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    minWidth: "100%",
    backgroundColor: "#12081A",
  },

  playlistPic: {
    width: 30,
    height: 30,
    marginVertical: 10,
  },

  playlistPicBig: {
    width: 80,
    height: 80,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  SongList: {
    width: "90%",
    alignSelf: "center",
    marginHorizontal: 10,
    marginVertical: 2,
    backgroundColor: "#12081A",
  },

  TextInput: {
    marginVertical: 5,
    marginLeft: 20,
    color: "white",
    justifyContent: "center",
    textAlignVertical: "auto",
  },

  inputView: {
    backgroundColor: "#12081A",
    borderWidth: 1,
    borderRadius: 20,
    width: "90%",
    minHeight: 45,
    marginTop: 20,
    marginBottom: 10,
  },
});
