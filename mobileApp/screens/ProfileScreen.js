import { React, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ProfileBox from "../components/ProfileBox";
import RowBox from "../components/RowBox";
import PostBox from "../components/PostBox";
import RepostBox from "../components/RepostBox";
import { API_URL } from "../constants/Info";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";

// COMPONENT BODY
export default function ProfileScreen({ route, navigation }) {
  const userID = route.params.userID;
  const myUserID = route.params.myUserID;
  const accessToken = route.params.accessToken;

  const isFollowed = useRef(route.params.isFollowed);
  const username = useRef("");
  const bio = useRef("");
  const hasProfileImage = useRef(false);
  const image = useRef("uri");
  const [postCount, setPostCount] = useState(0);
  const [likedPostCount, setLikedPostCount] = useState(0);
  const followingCount = useRef(0);
  const followerCount = useRef(0);
  const [profileLoading, setProfileLoading] = useState(true);

  const [postGridComplete, setPostGridComplete] = useState([]);
  const [likedPostGridComplete, setLikedPostGridComplete] = useState([]);
  const [postsOrLikes, setPostsOrLikes] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);

  const [postBox, setPostBox] = useState(<></>);

  const isFocused = useIsFocused();
  useEffect(async () => {
    setProfileLoading(true)
    await getUserData();
    setProfileLoading(false)
    getPosts();
    getLikedPosts();
  }, [isFocused]);

  //Gets user data from api
  async function getUserData() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID }),
    };
    await fetch(`${API_URL}/api/user/searchUser`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        username.current = response.user.username;

        if (
          response.user.spotify.connected &&
          response.user.profileImageUrl != undefined
        ) {
          hasProfileImage.current = true;
          image.current = response.user.profileImageUrl;
        } else {
          hasProfileImage.current = false;
        }
        bio.current = response.user.biography;

        if (response.user.followers != null)
        {
          followerCount.current = response.user.followers.length;
          if(response.user.followers.find(user => user === myUserID))
            isFollowed.current = true
          else
            isFollowed.current = false
        }
        if (response.user.following != null)
          followingCount.current = response.user.following.length;
      });
  }
  //Gets user posts from api
  function getPosts() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
        currentIndex: 0,
        numberOfPosts: 12,
      }),
    };
    fetch(`${API_URL}/api/post/getAllUsersPost`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        dividePostsIntoRows(response.posts, "Posts");
        setPostCount(response.posts.length);
      });
  }

  //Gets user liked posts from api
  function getLikedPosts() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
        currentIndex: 0,
        numberOfPosts: 12,
      }),
    };
    fetch(`${API_URL}/api/post/userLikedPosts`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        }
        dividePostsIntoRows(response.posts, "LikedPosts");
        setLikedPostCount(response.posts.length);
      });
  }

  function dividePostsIntoRows(posts, type) {
    var count = 0;
    var rowNum = 0;
    var postGrid = [];
    var postRow = [];
    if (posts.length == 0) {
      setPostGridComplete([]);
      return;
    }
    //Fills grid with post ids in retrieved posts
    for (var i = 0; i < posts.length; i++) {
      //new row if row has three items
      if (count == 3) {
        count = 0;
        postGrid[rowNum] = {
          key: rowNum,
          row: [postRow[0], postRow[1], postRow[2]],
        };
        rowNum++;
      }
      //add item to current row
      postRow[count] = {
        key: count,
        postID: posts[i]._id,
        image: posts[i].image,
      };
      count++;
    }
    // Finishes row with empty
    while (count != 3) {
      postRow[count] = { postID: 0 }; //Spot is empty
      count++;
    }
    postGrid[rowNum] = { key: rowNum, row: postRow };

    if (type === "Posts") {
      setPostGridComplete(postGrid);
      setIsLoading(false);
    } else {
      setLikedPostGridComplete(postGrid);
      setIsLoading(false);
    }
  }

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
          if (!response.ok) {
            console.log(response.error);
            res(<></>);
          }
          res(
            response.post.isReposted ? (
              <RepostBox
                navigation={navigation}
                repostID={response.post._id}
                author={response.post.author}
                originalPost={response.post.originalPost}
                timeStamp={response.post.timeStamp}
                myUserID={userID}
                accessToken={accessToken}
              />
            ) : (
              <PostBox
                navigation={navigation}
                postID={response.post._id}
                author={response.post.author}
                caption={response.post.caption}
                comments={response.post.comments}
                likedBy={response.post.likedBy}
                playlistID={response.post.playlistID}
                timeStamp={response.post.timeStamp}
                myUserID={userID}
                accessToken={accessToken}
              />
            )
          );
        });
    });
  }

  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.MainContainer}>
      {postVisible ? (
        <View style={styles.PostContainer}>
          {/* Post that was tapped*/}
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
        <View style={[styles.MainContainer, {width: "100%"}]}>
          {profileLoading 
          ? 
          <View style={{backgroundColor: "#12081A", width: "85%", marginTop: 20, borderRadius: 25}}>
            <ActivityIndicator size="large" color="#573C6B" style={{marginVertical: 50}}/>
          </View>
          :
          <ProfileBox
            username={username.current}
            bio={bio.current}
            image={image.current}
            hasProfileImage={hasProfileImage.current}
            postCount={postCount}
            followerCount={followerCount.current}
            followingCount={followingCount.current}
            myUserID={myUserID}
            targetUserID={userID}
            isFollowed={isFollowed.current}
            accessToken={accessToken}
            navigation={navigation}
          />
          }
          {/* Container for navigation between posts and likes */}
          <View style={styles.NavContainer}>
            {/* Posts and likes filter buttons */}
            <TouchableOpacity
              hitSlop={{ top: 40, bottom: 40, left: 90, right: 90 }}
              onPress={() => setPostsOrLikes("posts")}
            >
              <View style={{backgroundColor: "#12081A", paddingHorizontal: 30, paddingVertical: 5, borderRadius: 50}}>
                {postsOrLikes === "posts" ? (
                  <Ionicons name="grid" size={18} color="#573C6B" />
                ) : (
                  <Ionicons name="grid" size={18} color="white" />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 40, bottom: 40, left: 90, right: 90 }}
              onPress={() => setPostsOrLikes("likes")}
            >
              <View style={{backgroundColor: "#12081A", paddingHorizontal: 30, paddingVertical: 5, borderRadius: 50}}>
                {postsOrLikes === "likes" ? (
                  <Ionicons name="heart" size={20} color="#573C6B" />
                ) : (
                  <Ionicons name="heart" size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
          {/* Grid container */}
          <View style={{ width: "100%", alignItems: "center" }}>
            <View>
              {postsOrLikes === "posts" ? (
                // Posts container
                <View style={styles.GridColumnContainer}>
                  {postCount == 0 ? (
                    <Text style={{ color: "white", alignSelf: "center" }}>
                      This user has no posts
                    </Text>
                  ) : (
                    <View>
                      {isLoading ? (
                        <View style={{ justifyContent: "center", marginTop: 60 }}>
                          <ActivityIndicator size="large" color="#573C6B" />
                        </View>
                      ) : (
                      <FlatList
                        data={postGridComplete}
                        renderItem={({ item }) => (
                          <RowBox row={item.row} openPost={openPost} />
                        )}
                      />
                      )}
                    </View>
                  )}
                </View>
              ) : (
                // Likes container
                <View style={styles.GridColumnContainer}>
                  {likedPostCount == 0 ? (
                    <Text style={{ color: "white", alignSelf: "center" }}>
                      This user has no liked posts
                    </Text>
                  ) : (
                    <View>
                      {isLoading ? (
                        <View style={{ justifyContent: "center", marginTop: 60 }}>
                          <ActivityIndicator size="large" color="#573C6B" />
                        </View>
                      ) : (
                      <FlatList
                        data={likedPostGridComplete}
                        renderItem={({ item }) => (
                          <RowBox row={item.row} openPost={openPost} />
                        )}
                      />
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: "#23192B",
  },
  NavContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    width:"90%",
  },
  GridColumnContainer: {
    marginTop: 40,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    width: "80%",
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
  btnText: {
    fontSize: 15,
    marginHorizontal: 10,
    color: "white",
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
});
