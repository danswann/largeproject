import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "../constants/Info";
import FollowersListBox from "../components/FollowersListBox";
import SearchResultBox from "../components/SearchResultBox";
import { Ionicons } from "@expo/vector-icons";

export default function FollowersListScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const { accessToken, refreshToken } = route.params;
  const [followers, setFollowers] = useState([]);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userID: route.params.myUserID,
      targetID: route.params.userID,
    }),
  };
  // Fetch the list of users who follow this user
  useEffect(async () => {
    let response = await fetch(
      `${API_URL}/api/user/showFollowers`,
      requestOptions
    );
    if (!response.ok) {
      console.log(response.error);
      return;
    } else {
      let data = await response.json();
      setFollowers(data.followers);
    }
  }, [isFocused]);
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
        <Text style={styles.MainText}>Followers</Text>
      </View>
      {/* Reusing search result box to render follower list */}
      <FlatList
        data={followers}
        renderItem={({ item }) => (
          <SearchResultBox
            username={item.username}
            image={item.profileImageUrl}
            userID={item.userID}
            isFollowed={item.currentUserFollows}
            myUserID={route.params.myUserID}
            accessToken={accessToken}
            refreshToken={refreshToken}
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
