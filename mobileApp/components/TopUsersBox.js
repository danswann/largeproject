import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import PostBox from "./PostBox";
import { useState } from "react";

export default function TopUsersBox(props) {
  // Stuff to show the post
  const [postBox, setPostBox] = useState(<></>);
  const [postVisible, setPostVisible] = useState(false);
  const openPost = async (postID) => {
    setPostBox(await getPostBoxFromID(postID));
    setPostVisible(true);
  };
  function getPostBoxFromID(postID) {
    return new Promise((res, rej) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postID: postID }),
      };
      fetch(`${API_URL}/api/post/getPost`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            console.log(response.error);
            res(<></>);
          }
          res(
            <PostBox
              navigation={navigation}
              postID={response.post._id}
              author={response.post.author}
              caption={response.post.caption}
              comments={response.post.comments}
              isReposted={response.post.isReposted}
              likedBy={response.post.likedBy}
              originalPostID={response.post.originalPostID}
              playlistID={response.post.playlistID}
              timeStamp={response.post.timeStamp}
              myUserID={userID}
              accessToken={accessToken}
            />
          );
        });
    });
  }
  console.log("PROPS: ", props);
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
      }}
    >
      {props.rank === 0 && <Text style={styles.topUsersText}>Top Users</Text>}
      <View
        style={{
          marginTop: 30,
          flexDirection: "row",
          // backgroundColor: "yellow",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        {/* Rank */}
        <View
          style={{
            width: "10%",
            // backgroundColor: "blue",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            #{props.rank + 1}
          </Text>
        </View>
        {/* Profile pic and username */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            width: "55%",
            left: "-5%",
            justifyContent: "space-around",
          }}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          onPress={() => {
            props.navigation.navigate({
              name: "OtherProfile",
              params: { userID: props.userID, isFollowed: props.isFollowed },
            });
          }}
        >
          <View style={{ width: "10%" }}>
            <Image
              style={styles.profilePic}
              source={
                props.profilePic
                  ? { uri: props.profilePic }
                  : require("../assets/images/defaultSmile.png")
              }
            />
          </View>
          <View style={{ width: "60%", left: "5%" }}>
            <Text style={styles.usernameText}>{props.username}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ width: "25%", right: "30%" }}>
          <Text style={{ color: "white" }}>
            {props.followerCount} Followers
          </Text>
        </View>
      </View>
      <View style={{ position: "relative", height: 150 }}>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            left: "15%",
            marginTop: 20,
            width: "68%",
            //   backgroundColor: "green",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              openPost(props.postID1);
            }}
          >
            <Image
              style={styles.postImages}
              source={{ uri: props.postImage1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openPost(props.PostID2);
            }}
          >
            <Image
              style={styles.postImages}
              source={{ uri: props.postImage2 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openPost(props.postID3);
            }}
          >
            <Image
              style={styles.postImages}
              source={{ uri: props.postImage3 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  postImages: {
    aspectRatio: 1,
    width: "33%",
    marginRight: 10,
  },
  topUsersText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    left: "3%",
  },
  usernameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
