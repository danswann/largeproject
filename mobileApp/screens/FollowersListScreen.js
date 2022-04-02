import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { API_URL } from "../constants/Info";

export default function FollowersListScreen({ route }) {
  const [followers, setFollowers] = useState([]);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID: route.params.userID }),
  };
  fetch(`${API_URL}/api/user/showFollowers`, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      if (!response.ok) {
        console.log(response.error);
        return;
      } else {
        setFollowers(response.followers);
      }
    });
  return (
    <View style={styles.MainContainer}>
      {followers.length > 0 ? (
        followers.map((follower) => {
          return <Text style={styles.MainText}>{follower.username}</Text>;
        })
      ) : (
        <Text style={styles.MainText}>Loading...</Text>
      )}
    </View>
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
