import {React, useState, useEffect} from "react";
import { Text, View, StyleSheet, FlatList, Dimensions, Image, } from "react-native";
import ProfileBox from "../components/ProfileBox";
import RowBox from "../components/RowBox";
import { API_URL } from "../constants/Info";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// COMPONENT BODY
export default function ProfileScreen({ route, navigation }) {
  const userID = route.params.userID
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState([]);
  

  //When profile screen is focused update data
  const isFocused = useIsFocused();
  useEffect(() => {
    getDataFromID()
    //Does not work yet
    //getPostsfromID() 
  }, [isFocused]);

  //Gets user data from api
  function getDataFromID()
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
          return
        }
        setUsername(response.user.username)
        setBio(response.user.biography)
        if(response.user.followers != null)
          setFollowerCount(response.user.followers.length)
        if(response.user.following != null)
          setFollowingCount(response.user.following.length)
      })
  }
  //Gets user posts from api
  function getPostsfromID()
  {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID})
    };
    fetch(`${API_URL}/api/user/getAllUsersPost`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
          console.log(response.error)
          return
        }
        setPosts(response.post)
        setPostCount(posts.length)
      })
  }
  return (
    <View style={styles.MainContainer}>
      {/*Profile Info */}
      <ProfileBox
        username={username}
        bio={bio}
        postCount={postCount}
        followerCount={followerCount}
        followingCount={followingCount}
      />
      {/* Container for nav */}
      <View style={styles.NavContainer}>
        <Ionicons name="grid" size={20} color="white" />
        <Ionicons name="heart" size={20} color="white" />
      </View>
      {/* Grid container */}
      <View style={styles.GridColumnContainer}>
        <FlatList
            data={[ //dummy data, correct data will be the const posts
              {key: 1, row: [{key: 1, postID:1}, {key: 2, postID:2}, {key: 3, postID:3}]},
              {key: 2, row: [{key: 1, postID:1}, {key: 2, postID:2}, {key: 3, postID:3}]},
              {key: 3, row: [{key: 1, postID:1}, {key: 2, postID:2}, {key: 3, postID:3}]},
            ]} 
            renderItem={({item}) => <RowBox row={item.row}/>}
          />
       </View>
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
  },
  NavContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
    marginTop: 10,
  },
  GridColumnContainer: {
    marginTop: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "stretch",
  },

});
