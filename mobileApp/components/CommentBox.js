import {React, useState, useEffect} from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../constants/Info";
import { useIsFocused } from "@react-navigation/native";

// COMPONENT BODY
export default function CommentBox(props) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tapped, setTapped] = useState(false);
  //checks if user owns this comment before allowing access to delete button
  function checkUser(){
    if(tapped)
      setTapped(false)
    else if(props.myUserID == props.author._id)
      setTapped(true)
  }

  //deletes comment
  function deleteComment(){
    setDeleteLoading(true)
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: props.myUserID, postID: props.postID, commentID: props.commentID, accessToken: props.accessToken})
    };
    fetch(`${API_URL}/api/post/deleteComment`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      if(!response.ok)
        console.log(response.error)
      else
        props.update(response.post.comments)
  })
  };

  //get time since posted
  function getTimeSince()
  {
    let ms = new Date().getTime() - new Date(props.timeStamp).getTime();
    let days = ms / (1000 * 60 * 60 * 24)
    if(days > 1)
    {
      if(days < 2)
        return "1 day ago"
      return Math.floor(days) + " days ago"
    }
    let hours = days * 24
    if(hours > 1)
    {
      if(hours < 2)
        return "1 hour ago"
      return Math.floor(hours) + " hours ago"
    }
    let minutes = hours * 60
    if(minutes > 1)
    {
      if(minutes < 2)
        return "1 minute ago"
      return Math.floor(minutes) + " minutes ago"
    }
    return "A few moments ago"
  }
  return (
    <TouchableWithoutFeedback onPress={() => {checkUser()}}>
      <View style={styles.MessageContainer}>        
        <View style={{flexDirection: 'row', maxWidth: "60%"}}>
          {/* profile pic */}
          <Image
            source={{uri: props.author.profileImageUrl}}
            style={styles.ProfilePic}
          />
          <View style={{flexDirection: 'column', marginStart: 5, marginTop: 10, }}>
            {/* name */}
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12, textDecorationLine: "underline"}}>{props.author.username}</Text>
            {/* Comment */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10}}>
              <Text style={styles.MainText}>{props.comment}</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'column', alignItems:"flex-end"}}>
          {/* Timestamp */}
          <Text style={{color: 'white', textAlign: "right", marginVertical: 10, marginRight: 20, fontSize: 11}}>{getTimeSince()}</Text>
          <TouchableOpacity onPress={() => {deleteComment()}}>
            <View style={{marginHorizontal:10}}>
                {(deleteLoading ?  <ActivityIndicator size={20} color="white"/> : (tapped ? <Ionicons name="trash-outline" size={20} color={"red"}/> : <></>))}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
)}

const styles = StyleSheet.create({
  MainText: {
    color: "white",
    fontSize: 11
  },
  MessageContainer: {
    backgroundColor: "#12081A",
    borderColor: "#573C6B",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 25,
  },
  ProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 70,
    marginVertical: 10,
    marginHorizontal: 10
  },
})