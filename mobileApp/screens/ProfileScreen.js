import React from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";
import ProfileBox from "../components/ProfileBox";

// COMPONENT BODY
export default function ProfileScreen() {
  return (
    <View style={styles.MainContainer}>
      <FlatList
        data={[
          {
            key: 1,
            username: "JohnnyTest9",
            bio: "The best tunes in town! Follow me on IG: Johnny10",
            postCount: "157",
            followerCount: "10k",
            followingCount: "900",
          },
        ]}
        renderItem={({ item }) => (
          <ProfileBox
            username={item.username}
            bio={item.bio}
            postCount={item.postCount}
            followerCount={item.followerCount}
            followingCount={item.followingCount}
          />
        )}
      />
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
