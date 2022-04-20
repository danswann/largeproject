import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect } from "react";
import PostBox from "./PostBox";
import RepostBox from "./RepostBox";
import { useState } from "react";
import { API_URL } from "../constants/Info";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function TopUsersBox(props) {
  // Stuff to show the post
  const [postBox, setPostBox] = useState(<></>);
  const [postVisible, setPostVisible] = useState(false);

  // Keeping state of post images
  const [postImage1, setPostimage1] = useState(props.postImage1);
  const [postImage2, setPostimage2] = useState(props.postImage2);
  const [postImage3, setPostimage3] = useState(props.postImage3);

  const isFocused = useIsFocused();

  useEffect(() => {
    setPostimage1(null);
    setPostimage2(null);
    setPostimage3(null);
    setPostimage1(props.postImage1);
    setPostimage2(props.postImage2);
    setPostimage3(props.postImage3);
  }, [isFocused, props.username]);

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
    <TouchableWithoutFeedback>
      <View
        style={{
          flex: 1,
          width: "90%",
          left: "5%",
          borderWidth: 1,
          borderColor: "#573C6B",
          borderRadius: 10,
          backgroundColor: "#12081A",
          marginBottom: 20,
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
            <View
              style={{
                marginTop: 30,
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              {/* Rank */}
              <View
                style={{
                  width: "10%",
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
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={styles.usernameText}
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                    >
                      {props.username}
                    </Text>
                    {props.rank <= 2 ? (
                      <Ionicons
                        name={"trophy"}
                        size={16}
                        color={
                          props.rank === 0
                            ? "gold"
                            : props.rank === 1
                            ? "silver"
                            : "#CD7F32"
                        }
                        style={{ marginTop: 1.7, marginLeft: 3 }}
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{ width: "25%", right: "90%" }}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  {props.followerCount} Followers
                </Text>
              </View>
            </View>
            <View style={{ position: "relative", height: 150 }}>
              {/* Rendering the users posts */}
              <FlatList
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  top: "2%",
                  left: "15%",
                  marginTop: 20,
                  width: "72%",
                  height: "55%",
                }}
                data={props.posts}
                renderItem={(item) => {
                  console.log("ITEM: ", item);
                  return (
                    <TouchableOpacity
                      style={{ width: "100%" , marginRight: 10}}
                      onPress={() => {
                        openPost(item.item._id);
                      }}
                    >
                      <Image
                        style={styles.postImages}
                        source={{ uri: item.item.image }}
                      />
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => item._id}
              ></FlatList>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    height: "100%",
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
