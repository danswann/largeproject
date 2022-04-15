import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function TopUsersBox(props) {
  console.log("PROPS: ", props);
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
      }}
    >
      {props.rank === 0 && <Text style={styles.topUsersText}>Top Users</Text>}
      <View
        style={{
          marginTop: 30,
          flexDirection: "row",
          // backgroundColor: "red",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            width: "10%",
            // backgroundColor: "blue",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            #{props.rank + 1}
          </Text>
        </View>
        <View style={{ width: "10%" }}>
          <Image
            style={styles.profilePic}
            source={
              props.profilePic
                ? { uri: props.profilePic }
                : require("../assets/images/defaultSmile.png")
            }
          />
        </View>
        <View style={{ width: "30%" }}>
          <Text style={styles.usernameText}>{props.username}</Text>
        </View>
        <View style={{ width: "25%" }}>
          <Text style={{ color: "white" }}>
            {props.followerCount} Followers
          </Text>
        </View>
      </View>
      <View style={{ position: "relative", height: 150 }}>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            left: "20%",
            marginTop: 20,
            width: "66%",
            //   backgroundColor: "green",
          }}
        >
          <Image style={styles.postImages} source={{ uri: props.postImage1 }} />
          <Image style={styles.postImages} source={{ uri: props.postImage2 }} />
          <Image style={styles.postImages} source={{ uri: props.postImage3 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  postImages: {
    aspectRatio: 1,
    width: "33%",
    marginRight: 10,
  },
  topUsersText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    left: "5%",
  },
  usernameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
