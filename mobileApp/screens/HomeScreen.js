import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";

import PostBox from "../components/PostBox";

// COMPONENT BODY
export default function HomeScreen() {
  return (
    <View style={HomeScreenStyles.HomeScreenStyles}>
      <FlatList
        data={[
          {key: 1, name: 'Doug', message: 'Chill vibes 💤💤💤', timeStamp: '34 min', title: 'chillin...', songCount: 8, likeCount: 11, commentCount: 6},
          {key: 2, name: 'Doug', message: 'Chill vibes 💤💤💤', timeStamp: '34 min', title: 'chillin...', songCount: 8, likeCount: 11, commentCount: 6},
          {key: 3, name: 'Doug', message: 'Chill vibes 💤💤💤', timeStamp: '34 min', title: 'chillin...', songCount: 8, likeCount: 11, commentCount: 6},
          {key: 4, name: 'Doug', message: 'Chill vibes 💤💤💤', timeStamp: '34 min', title: 'chillin...', songCount: 8, likeCount: 11, commentCount: 6},
        ]}
        renderItem={({item}) => <PostBox name={item.name} message={item.message} timeStamp={item.timeStamp} title={item.title} songCount={item.songCount} likeCount={item.likeCount} commentCount={item.commentCount}/>}
      />
    </View>
  );
}

// COMPONENT STYLES
const HomeScreenStyles = StyleSheet.create({
  HomeScreenStyles: {
    justifyContent: "center",
    alignItems:"center",
    backgroundColor: "#23192B",
  },
});
