import {React , useState, useEffect} from "react";
import { Text, View, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { API_URL } from "../constants/Info";
import PostBox from "../components/PostBox";

// COMPONENT BODY
export default function HomeScreen({ route, navigation }) {
  const userID = route.params.userID
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);

  let mounted = false

  useEffect(() => {
    if(mounted)
      setLoading(true)
    getFeed()
    return function cleanup() { //if user navigates away before an api call is finished, this prevents error
      mounted = false
  }
  }, []);

  function getFeed()
  {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID, currentIndex: currentIndex})
    };
    fetch(`${API_URL}/api/post/homeFeed`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(response.ok)
          if(mounted)
            setFeed(response.posts)
        else
        {
          if(mounted)
          {
            setFeed([])
            console.log(response.error) //This keeps spitting out undefined
          }
        }
        if(mounted)
          setLoading(false)
      })
  }
  return (
    <View style={styles.mainContainer}>
      {(!loading ? 
      ((feed.length == 0) ? 
      (<View style ={styles.emptyContainer}>
        {/*Feed is empty*/}
        <Image
          source={require('../assets/images/defaultSmile.png')} //make this something more relevant
          style={styles.emptyImage}
        />
        <Text style ={styles.emptyText}>{"There are no posts in your feed!"}</Text>
        <Text style ={styles.emptyText}>{"Try following users in the search tab."}</Text> 
      </View>) :
      (<FlatList
        data={feed}
        renderItem={({item}) => <PostBox postID={item._id} myUserID={userID} userID={item.userID} message={item.caption} timeStamp={item.timeStamp} playlistID={item.playlistID} likedBy={item.likedBy} comments={item.comments}/>}
        keyExtractor={(item, index) => index.toString()}
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
