import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "../constants/Info";
import SearchResultBox from "../components/SearchResultBox";
import { Ionicons } from "@expo/vector-icons";

export default function FollowingListScreen({ route, navigation }) {
  console.log("FollowingListScreen: ", route.params.userID);
  const [followings, setFollowings] = useState([]);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID: route.params.userID }),
  };
  // Fetch the following list of this user
  useEffect(async () => {
    let response = await fetch(
      `${API_URL}/api/user/showFollowings`,
      requestOptions
    );
    if (!response.ok) {
      console.log(response.error);
      return;
    } else {
      let data = await response.json();
      console.log("DATA FOLLOWING ", data.following);
      // Fetch the followers of each of the users in the following list
      data.following.forEach(async (following, index) => {
        const followerRequestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: following.userID }),
        };
        let followerResponse = await fetch(
          `${API_URL}/api/user/showFollowers`,
          followerRequestOptions
        );
        let followerData = await followerResponse.json();
        data.following[index].followers = followerData.followers;
      });
      setFollowings(data.following);
    }
  }, [route.params.userID]);
  return (
    <View style={styles.MainContainer}>
      {/* Go back button */}
      <View style={styles.Header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.BackButton}
        >
          <Ionicons
            style={{ color: "white", marginRight: 5 }}
            name="chevron-back-outline"
            size={25}
          />
        </TouchableOpacity>
        <Text style={styles.MainText}>Following</Text>
      </View>
      {/* Reusing search result box to render follower list */}
      <FlatList
        data={followings}
        renderItem={({ item }) => (
          <SearchResultBox
            username={item.username}
            userID={item.userID}
            followers={item.followers}
            myUserID={route.params.myUserID}
            navigation={navigation}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  MainText: {
    color: "white",
    fontSize: 20,
  },
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23192B",
  },
  BackButton: {
    position: "absolute",
    left: "2%",
    height: 100,
    width: 100,
  },
  Header: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
    position: "relative",
  },
});
