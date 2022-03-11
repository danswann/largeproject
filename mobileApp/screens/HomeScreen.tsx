import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

// import EditScreenInfo from "../components/EditScreenInfo";
// import { Text, View } from "../components/Themed";
// import { RootTabScreenProps } from "../types";

const HomeScreen = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Click Me" onPress={() => alert("Button Clicked")} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8fcbbc",
  },
});
