import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import PostBox from "./PostBox";
import RepostBox from "./RepostBox";
import { useState } from "react";
import { API_URL } from "../constants/Info";

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
            response.post.isReposted ? (
              <RepostBox
                navigation={props.navigation}
                repostID={response.post._id}
                author={response.post.author}
                originalPost={response.post.originalPost}
                timeStamp={response.post.timeStamp}
                myUserID={props.myUserID}
                accessToken={props.accessToken}
              />
            ) : (
              <PostBox
                navigation={props.navigation}
                postID={response.post._id}
                author={response.post.author}
                caption={response.post.caption}
                comments={response.post.comments}
                likedBy={response.post.likedBy}
                playlistID={response.post.playlistID}
                timeStamp={response.post.timeStamp}
                myUserID={props.myUserID}
                accessToken={props.accessToken}
              />
            )
          );
        });
    });
  }
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
      }}
    >
      {postVisible ? (
        <View style={styles.PostContainer}>
          {/* Opened post */}
          {postBox}
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setPostVisible(false)}
          >
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {props.rank === 0 && (
            <Text style={styles.topUsersText}>Top Users</Text>
          )}
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
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
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
                  params: {
                    userID: props.userID,
                    isFollowed: props.isFollowed,
                  },
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
                <Text
                  style={styles.usernameText}
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                >
                  {props.username}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ width: "25%", right: "90%" }}>
              <Text style={{ color: "white", textAlign: "right" }}>
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
                style={{ width: "33%" }}
                onPress={() => {
                  if (props.postID1) {
                    openPost(props.postID1);
                  }
                }}
              >
                <Image
                  style={styles.postImages}
                  source={{ uri: props.postImage1 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: "33%", marginLeft: 10 }}
                onPress={() => {
                  if (props.postID2) {
                    openPost(props.postID2);
                  }
                }}
              >
                <Image
                  style={styles.postImages}
                  source={{ uri: props.postImage2 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: "33%", marginLeft: 10 }}
                onPress={() => {
                  if (props.postID3) {
                    openPost(props.postID3);
                  }
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
      )}
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
    width: "100%",
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
  closeBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#573C6B",
  },
  btnText: {
    fontSize: 15,
    marginHorizontal: 10,
    color: "white",
  },
  PostContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "60%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },
});
