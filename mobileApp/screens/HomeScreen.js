import React, { useState, useEffect} from "react";
import { Text, View, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { API_URL } from "../constants/Info";
import PostBox from "../components/PostBox";
import RepostBox from "../components/RepostBox";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../Context";

// COMPONENT BODY
export default function HomeScreen({ route, navigation }) {
  const { userID, accessToken, refreshToken, reload } = route.params;

  //Number of posts loaded per batch for lazy loading
  const numPostsLoaded = 5;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostsLoading, setNewPostsLoading] = useState(false);
  const [endOfFeed, setEndOfFeed] = useState(false);

  const { refresh } = React.useContext(AuthContext);

  const isFocused = useIsFocused();
  useEffect(async () => {
    setLoading(true), 
    getFeed(0), 
    setCurrentIndex(0)
  }, [isFocused, reload]);

  

  async function getFeed(index)
  {
    //refreshes access token (this function must be async)
    //const access = await refresh(userID, refreshToken)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID, currentIndex: index, numberOfPosts: numPostsLoaded, accessToken: accessToken})
    };
    console.log("Loading at index: " + index)
    fetch(`${API_URL}/api/post/homeFeed`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(response.ok)
        {
          if(isFocused)
          {
            if(index != 0)
            {
              console.log("Loading more posts...")
              setFeed(feed.concat(response.posts))
              if(response.posts.length == 0)
                setEndOfFeed(true)
              else
                setEndOfFeed(false)
              setCurrentIndex(currentIndex + numPostsLoaded)
              setNewPostsLoading(false)
            }
            else
            {
              console.log("Refresh posts...")
              setEndOfFeed(false)
              setFeed(response.posts)
              setCurrentIndex(0)
              setLoading(false)
            }
          }
        }
        else
        {
          if(isFocused)
          {
            setFeed([])
            console.log(response.error) //This keeps spitting out undefined
          }
        }
      })
  }



  return (
    <View style={styles.mainContainer}>
      {(!loading ? 
      ((feed.length == 0) ? 
      (<View style ={styles.emptyContainer}>
        {/*Feed is empty*/}
        {/* <Image
          source={require('../assets/images/defaultSmile.png')} //make this something more relevant
          style={styles.emptyImage}
        /> */}
        <Text style ={styles.emptyText}>{"There are no posts in your feed!"}</Text>
        <Text style ={styles.emptyText}>{"Try following users in the search tab."}</Text> 
      </View>) :
      (<FlatList
        data={feed}
        overScrollMode="never"
        onRefresh={() => [setLoading(true), getFeed(0)]}
        refreshing={(loading || newPostsLoading)}
        onEndReached={() => [getFeed(currentIndex + numPostsLoaded)]}
        onEndReachedThreshold={.2}
        ListFooterComponent={
          <View style={{width: "100%", height: 70, marginTop: 50}}>
            {(endOfFeed ?
            <Text style ={styles.emptyText}>{"There are no more posts in your feed!"}</Text>
            :
            <ActivityIndicator size={25} color="white" />
            )}
          </View>
        }
        renderItem={({item}) => 
          (item.isReposted ?
          <RepostBox
            navigation={navigation}
            repostID={item._id}
            author={item.author}
            originalPost={item.originalPost}
            timeStamp={item.timeStamp}
            myUserID={userID} 
            accessToken={accessToken} 
            refreshToken={refreshToken}
          />
            :
          <PostBox 
            navigation={navigation}
            postID={item._id} 
            author={item.author} 
            caption={item.caption}
            comments={item.comments}
            likedBy={item.likedBy}
            playlistID={item.playlistID} 
            timeStamp={item.timeStamp}
            myUserID={userID} 
            accessToken={accessToken} 
            refreshToken={refreshToken}
          />)}
        listKey={(item, index) => `_key${index.toString()}`}
        keyExtractor={(item, index) => `_key${index.toString()}`}
      />))
      :
      <View style ={styles.emptyContainer}>
        {/*Screen is loading*/}
        <ActivityIndicator size="large" color="#573C6B" style={{}} />
      </View>)}
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  mainContainer: {
    alignItems:"center",
    backgroundColor: "#23192B",
    height: "100%"
  },
  emptyContainer: {
    marginTop: 80,
    alignSelf: "center",
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginBottom: 5
  },
  emptyImage: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 70,
    marginVertical: 20,
    marginHorizontal: 10
},
});
