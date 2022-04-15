import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Animated,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import SongBox from "./SongBox";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from "../constants/Info";
import CommentBox from "./CommentBox";
import { AuthContext } from "../Context";


// COMPONENT BODY
export default function PostBox(props) {
  /*
    postID={item._id} 
    isReposted={item.isReposted}
    originalPostID={item.likedBy}
  */
  const comments = useRef(props.comments)
  const commentCount = useRef(props.comments.length)

  const liked = useRef(props.likedBy.find((user) => user === props.myUserID))
  const likeCount = useRef(props.likedBy.length)

  const [commentInput, setCommentInput] = useState("");
  const scrollRef = useRef()

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [songsExpanded, setSongsExpanded] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const isFocused = useIsFocused();

  const playlistName = useRef("")
  const playlistCover = useRef("http://placehold.jp/3d4070/ffffff/100x100.png?text=No%0Art")
  const playlistIsPublic = useRef(false)
  const playlistTracks = useRef([])
  const playlistTracksLazy = useRef([])
  const songCount = useRef(0)

  useEffect(() => {
    getPlaylistDataFromID();
  }, []);

  const { refresh } = React.useContext(AuthContext);

  function getPlaylistDataFromID() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: props.userID,
        playlistID: props.playlistID,
      }),
    };
    fetch(`${API_URL}/api/spotify/getPlaylistData`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        playlistName.current = response.playlist.name
        playlistCover.current = response.playlist.image
        playlistIsPublic.current = response.playlist.public
        playlistTracks.current = response.playlist.tracks
        playlistTracksLazy.current = response.playlist.tracks.slice(0, 4)
        songCount.current = response.playlist.tracks.length
        console.log("Rendering Post:" + playlistName.current)
        setLoading(false);
      });
  }

  //get time since posted
  function getTimeSince() {
    let ms = new Date().getTime() - new Date(props.timeStamp).getTime();
    let days = ms / (1000 * 60 * 60 * 24);
    if (days > 1) {
      if (days < 2) return "1 day ago";
      return Math.floor(days) + " days ago";
    }
    let hours = days * 24;
    if (hours > 1) {
      if (hours < 2) return "1 hour ago";
      return Math.floor(hours) + " hours ago";
    }
    let minutes = hours * 60;
    if (minutes > 1) {
      if (minutes < 2) return "1 minute ago";
      return Math.floor(minutes) + " minutes ago";
    }
    return "A few moments ago";
  }

  //expands songs
  function songsTapped() {
    playlistTracksLazy.current = playlistTracks.current
    if (songsExpanded) setSongsExpanded(false);
    else setSongsExpanded(true);
  }

  //expands comments
  function commentsTapped() {
    if (commentsExpanded) setCommentsExpanded(false);
    else setCommentsExpanded(true);
  }

  //like post
  async function likePost() {
    //refreshes access token (this function must be async)
    //const access = await refresh(props.myUserID, props.refreshToken)
    setLikeLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postID: props.postID,
        userID: props.myUserID,
        accessToken: props.accessToken,
      }),
    };
    fetch(`${API_URL}/api/post/likePost`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        if (isFocused) {
          likeCount.current = response.post.likedBy.length
          liked.current = response.post.likedBy.find((user) => user === props.myUserID)
          setLikeLoading(false);
        }
      });
  }

  //comment on post
  async function makeComment() {
    if (commentInput == "") return;
    //refreshes access token (this function must be async)
    //const access = await refresh(props.myUserID, props.refreshToken)
    setCommentLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postID: props.postID,
        comment: commentInput,
        userID: props.myUserID,
        accessToken: props.accessToken,
      }),
    };
    fetch(`${API_URL}/api/post/commentOnPost`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        } else {
          comments.current = response.post.comments
          commentCount.current = response.post.comments.length
          setCommentInput("");
          scrollRef.current.scrollToEnd()
          setCommentLoading(false);
        }
      });
  }

  const updatePostComments = (commentsUpdate) => {
    comments.current = commentsUpdate
    commentCount.current = commentsUpdate.length
  };

  //Redirect to url button component
  const OpenURLButton = ({ children }) => {
    const handlePress = useCallback(async () => {
      const url = "spotify:playlist:" + props.playlistID + ":play"
      console.log(url)
      await Linking.openURL(url);
    });
    return (
      <TouchableOpacity 
        style={{
          width: 30,
          borderRadius: 15,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
          backgroundColor: "#573C6B",
        }} 
        onPress={handlePress}
      >
        <Ionicons name="play" color="white" size={15} style={{marginLeft:3}}/>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.PostContainer}>
      {loading ? (
        <View style={styles.EmptyContainer}>
          <ActivityIndicator size="large" color="#573C6B" />
        </View>
      ) : (
        <View>
          {/* Post Message */}
          <View style={styles.MessageContainer}>
            <View style={{ flexDirection: "row"  }}>
              <TouchableOpacity style={{ flexDirection: "row", width: "75%" }}
              onPress={() => {
                props.navigation.navigate({
                  name: "OtherProfile",
                  params: { userID: props.author._id },
                });
              }}
              >
                {/* profile pic */}
                <Image
                  source={
                    (props.author.profileImageUrl != undefined)
                      ? { uri: props.author.profileImageUrl }
                      : require("../assets/images/defaultSmile.png")
                  } //default image
                  style={styles.ProfilePic}
                />
                <View
                  style={{
                    flexDirection: "column",
                    marginStart: 5,
                    marginTop: 10,
                  }}
                >
                  {/* name */}
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 12,
                      textDecorationLine: "underline",
                    }}
                  >
                    {props.author.username}
                  </Text>
                  {/* Message */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                      marginBottom: 10,
                    }}
                  >
                    <Text style={styles.MainText}>{props.caption}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:"column", alignItems: "center", justifyContent:"space-between"}}>
              {/* Timestamp */}
              <Text
                style={{
                  color: "white",
                  textAlign: "right",
                  marginTop: 10,
                  marginRight: 20,
                  fontSize: 11,
                }}
              >
                {getTimeSince()}
              </Text>
            </View>
          </View>

          {/* Playlist Info */}
          <View style={styles.PlaylistContainer}>
            {/* When songs are tapped, song list expands and can be scrolled */}
            {songsExpanded ? (
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ flexDirection: "row", display: "none"}}>
                  <View
                    style={{
                      flexDirection: "column",
                      marginStart: 15,
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <View style={{width: 150}}>
                      {/* Playlist Title */}
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 18,
                          textDecorationLine: "underline",
                          
                        }}
                      >
                        {playlistName.current}
                      </Text>

                      {/* Song Count */}
                      <Text style={{ color: "white", fontSize: 8 }}>
                        {songCount.current} songs
                      </Text>
                    </View>
                    {/* Playlist Image */}
                    <Image
                      source={{ uri: playlistCover.current }}
                      style={styles.PlaylistPic}
                    />
                  </View>
                </View>
                {/* Playlist Songs */}
                {songCount.current == 0 ? (
                  <Text
                    style={{ color: "white", marginLeft: 30, marginTop: 20 }}
                  >
                    No songs...
                  </Text>
                ) : (
                <ScrollView
                  overScrollMode="never"
                  style={{ maxHeight: 205, marginVertical: 10, marginHorizontal:10 }}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      songsTapped();
                    }}
                  >
                    {playlistTracksLazy.current.map((item, index) => {
                      return (
                      <SongBox
                        key={index.toString()}
                        songCover={item.image}
                        songName={item.name}
                        songArtists={item.artists}
                        songLength={item.duration}
                      />
                      )
                    })}
                  </TouchableOpacity>
                </ScrollView>
                )}
              </View>
            ) : (
              <View style={{ width: "100%", flexDirection: "row" }}>
                  <View
                    style={{
                      flexDirection: "column",
                      marginStart: 15,
                      justifyContent: "space-between",
                      marginTop: 5,
                    }}
                  >
                    <View style={{ flexDirection: "row"}}>
                      <View style={{width: 110}}>
                        {/* Playlist Title */}
                        <Text
                          numberOfLines={1}
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 18,
                            textDecorationLine: "underline",
                          }}
                        >
                          {playlistName.current}
                        </Text>

                        {/* Song Count */}
                        <Text style={{ color: "white", fontSize: 8 }}>
                          {songCount.current} songs
                        </Text>

                      </View>
                      <View style={{width:40, height: 40, justifyContent:"center", alignItems: "center"}}>
                        {/* Listen button */}
                        <OpenURLButton/>
                      </View>
                    </View>
                    {/* Playlist Image */}
                    <Image
                      source={{ uri: playlistCover.current }}
                      style={styles.PlaylistPic}
                    />
                  </View>
                {/* Playlist Songs */}
                {songCount.current == 0 ? (
                  <Text
                    style={{ color: "white", marginLeft: 30, marginTop: 20 }}
                  >
                    No songs...
                  </Text>
                ) : (
                  <ScrollView
                    overScrollMode="never"
                    style={{ maxHeight: 205, marginVertical: 10, marginHorizontal:10, }}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        songsTapped();
                      }}
                    >
                      {playlistTracksLazy.current.map((item, index) => {
                        return (
                        <SongBox
                          key={index.toString()}
                          songCover={item.image}
                          songName={item.name}
                          songArtists={item.artists}
                          songLength={item.duration}
                        />
                        )
                      })}
                    </TouchableOpacity>
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          {/* Comments */}
          {commentsExpanded ? (
            <View style={styles.CommentsContainer}>
              {comments.current.length == 0 ? (
                <Text
                  style={{ color: "white", marginLeft: 20, marginVertical: 10 }}
                >
                  No Comments...
                </Text>
              ) : (
                <ScrollView
                  overScrollMode="never"
                  style={{ maxHeight: 205 }}
                  nestedScrollEnabled={true}
                  ref={scrollRef}
                >
                  <Text
                    style={{
                      color: "white",
                      marginLeft: 20,
                      marginTop: 10,
                      fontSize: 12,
                    }}
                  >
                    Comments:{" "}
                  </Text>
                  {comments.current.map((item, index) => {
                    return (
                    <CommentBox
                      key={index.toString()}
                      postID={props.postID}
                      commentID={item._id}
                      author={item.author}
                      comment={item.comment}
                      timeStamp={item.timeStamp}
                      update={updatePostComments}
                      myUserID={props.myUserID}
                      accessToken={props.accessToken}
                      refreshToken={props.refreshToken}
                    />
                    )
                  })}
                </ScrollView>
              )}
              <View style={styles.MakeCommentContainer}>
                <TextInput
                  value={commentInput}
                  style={styles.textInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="#12081A"
                  onChangeText={(text) => setCommentInput(text)}
                  multiline={true}
                  clearButtonMode="while-editing"
                  selectionColor={"#573C6B"}
                />
                <TouchableOpacity
                  onPress={() => {
                    [makeComment()];
                  }}
                >
                  <View style={{ marginHorizontal: 10 }}>
                    {commentLoading ? (
                      <ActivityIndicator size={25} color="#12081A" />
                    ) : (
                      <Ionicons
                        name="arrow-forward-outline"
                        size={25}
                        color={"#12081A"}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )}

          {/* Post Buttons and Info */}
          <View style={styles.BarContainer}>
            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 20,
              }}
            >
              {likeLoading ? (
                <ActivityIndicator
                  size={25}
                  color="#573C6B"
                  style={{ marginRight: 20 }}
                />
              ) : (
                <TouchableOpacity onPress={() => likePost()}>
                  <Ionicons
                    style={
                      liked.current
                        ? { color: "#573C6B", marginRight: 20 }
                        : { color: "white", marginRight: 20 }
                    }
                    name="heart"
                    size={25}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => commentsTapped()}>
                <Ionicons
                  style={
                    commentsExpanded
                      ? { color: "#573C6B", marginRight: 20 }
                      : { color: "white", marginRight: 20 }
                  }
                  name="chatbox"
                  size={25}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  style={{ color: "white", marginRight: 20 }}
                  name="repeat"
                  size={25}
                />
              </TouchableOpacity>
            </View>
            {/* Post Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Text
                    style={{
                      color: "#A57FC1",
                      textAlign: "right",
                      fontSize: 9,
                    }}
                  >
                    {likeCount.current}
                  </Text>
                  <Text
                    style={{ color: "white", textAlign: "right", fontSize: 9 }}
                  >
                    {" "}
                    likes
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Text
                    style={{
                      color: "#A57FC1",
                      textAlign: "right",
                      fontSize: 9,
                    }}
                  >
                    {commentCount.current}
                  </Text>
                  <Text
                    style={{ color: "white", textAlign: "right", fontSize: 9 }}
                  >
                    {" "}
                    comments
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainText: {
    color: "white",
    fontSize: 11,
  },

  EmptyContainer: {
    backgroundColor: "#12081A",
    justifyContent: "center",
    minHeight: 330,
    minWidth: "99%",
    borderRadius: 23,
    marginVertical: 2,
    marginHorizontal: 2,
  },

  PostContainer: {
    backgroundColor: "#573C6B",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 15,
    width: "98%",
    borderRadius: 25,
  },

  MessageContainer: {
    backgroundColor: "#12081A",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginHorizontal: 2,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },

  ProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 70,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  PlaylistContainer: {
    backgroundColor: "#12081A",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginHorizontal: 2,
  },

  PlaylistPic: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },

  SongList: {
    marginHorizontal: 10,
    marginVertical: 2,
    backgroundColor: "#23192B",
  },

  CommentsContainer: {
    backgroundColor: "#12081A",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 2,
    marginHorizontal: 2,
  },

  textInput: {
    justifyContent: "center",
    flex: 1,
    marginVertical: 5,
    marginRight: 5,
    marginLeft: 10,
    color: "#12081A",
    alignSelf: "center",
    textAlignVertical:"auto",
  },

  MakeCommentContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 20,
  },

  BarContainer: {
    backgroundColor: "#12081A",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 45,
    marginTop: 2,
    marginBottom: 2,
    marginHorizontal: 2,
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
  },
});
