import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from "../constants/Info";
import SearchResultBox from "../components/SearchResultBox";
import { Ionicons } from "@expo/vector-icons";

export default function FollowingListScreen({ route, navigation }) {
  console.log("TARGET ID: ", route.params.userID);
  const isFocused = useIsFocused();
  const { accessToken, refreshToken } = route.params;
  const [followings, setFollowings] = useState([]);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userID: route.params.myUserID,
      targetID: route.params.userID,
    }),
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
      // Set the following list of the user
      console.log("DATA FOLLOWING LIST SCREEN", data);
      setFollowings(data.following);
    }
  }, [isFocused]);
  console.log("Followings Data: ", followings);
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
      {/* Reusing search result box to render following list */}
      <FlatList
        data={followings}
        renderItem={({ item }) => (
          <SearchResultBox
            username={item.username}
            userID={item.userID}
            myUserID={route.params.myUserID}
            isFollowed={item.currentUserFollows}
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
