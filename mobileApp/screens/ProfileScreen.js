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
  const [username, setUsername] = useState([""]);
  const [bio, setBio] = useState([""]);
  const [postCount, setPostCount] = useState([0]);
  const [followingCount, setFollowingCount] = useState([0]);
  const [followerCount, setFollowerCount] = useState([0]);
  const [posts, setPosts] = useState([]);
  const [postGridComplete, setPostGridComplete] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    getDataFromID()
    getPostsfromID()
    dividePostsIntoRows()
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
    fetch(`${API_URL}/api/post/getAllUsersPost`, requestOptions)
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
  function dividePostsIntoRows()
  {
    var count = 0
    var rowNum = 0
    var postGrid = []
    var postRow = []
    if(posts.length == 0) {
      setPostGridComplete([])
      return
    }
    //Fills grid with post ids in retrieved posts
    for(var i = 0; i < posts.length; i++)
    {
      //new row if row has three items
      if (count == 3)
      {
        count = 0
        postGrid[rowNum] = {key: rowNum, row: [postRow[0], postRow[1], postRow[2]]}
        rowNum++
      }
      //add item to current row
      postRow[count] = {key: count, postID: posts[i]._id}
      count++
    }
    // Finishes row with empty
    while (count != 3) 
    {
      postRow[count] = {postID: 0} //Spot is empty
      count++
    }
    postGrid[rowNum] = {key: rowNum, row: postRow}
    setPostGridComplete(postGrid)
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
        navigation={navigation}
      />
      {/* Container for nav */}
      <View style={styles.NavContainer}>
        <Ionicons name="grid" size={20} color="white" />
        <Ionicons name="heart" size={20} color="white" />
      </View>
      {/* Grid container */}
      <View style={styles.GridColumnContainer}>
        {(postCount == 0 ? 
        <Text style={{color: "white"}}>This user has no posts</Text> :
        <FlatList
          data={postGridComplete} 
          renderItem={({item}) => <RowBox row={item.row}/>}
        />
        )}
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
