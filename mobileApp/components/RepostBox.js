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
import PostBox from "./PostBox"

// COMPONENT BODY
export default function RepostBox(props) {
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


  return (
    <View style={styles.EmptyContainer}>
          {/* Post Message */}
          <View style={styles.MessageContainer}>
            <View style={{ flexDirection: "row"  }}>
              <TouchableOpacity style={{ flexDirection: "row", width: "65%" }}
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
                    <Text style={styles.MainText}>{props.author.username + " reposted this post."}</Text>
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
      <PostBox 
          navigation={props.navigation} 
          postID={props.originalPost._id} 
          author={props.originalPost.author} 
          caption={props.originalPost.caption}
          comments={props.originalPost.comments}
          likedBy={props.originalPost.likedBy}
          playlistID={props.originalPost.playlistID} 
          timeStamp={props.originalPost.timeStamp}
          myUserID={props.myUserID} 
          accessToken={props.accessToken} 
        />
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
    borderRadius: 32,
    marginVertical: 2,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: "#573C6B",
    padding: 5,
    paddingBottom: 10
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
});
