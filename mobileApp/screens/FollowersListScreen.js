import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { API_URL } from "../constants/Info";
import FollowersListBox from "../components/FollowersListBox";

export default function FollowersListScreen({ route, navigation }) {
  console.log("FollowersListScreen: ", route.params.userID);
  const [followers, setFollowers] = useState([]);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID: route.params.userID }),
  };
  // Fetch the list of users who follow this user
  useEffect(() => {
    fetch(`${API_URL}/api/user/showFollowers`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          console.log(response.error);
          return;
        } else {
          setFollowers(response.followers);
          console.log("RESPONSE: ", response);
        }
      });
    console.log(followers);
  }, [route.params.userID]);
  return (
    <View style={styles.MainContainer}>
      <FlatList
        data={followers}
        renderItem={({ item }) => (
          <FollowersListBox username={item.username} userID={item.userID} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    // <View style={styles.MainContainer}>
    //   {followers.length > 0 ? (
    //     followers.map((follower) => {
    //       return <Text style={styles.MainText}>{follower.username}</Text>;
    //     })
    //   ) : (
    //     <Text style={styles.MainText}>Loading...</Text>
    //   )}
    // </View>
  );
}

const styles = StyleSheet.create({
  MainText: {
    color: "white",
  },
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23192B",
  },
});
