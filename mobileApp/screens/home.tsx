import React from "react";
import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function Home({ navigation }: RootTabScreenProps<"Home">) {
  return <View style={styles.container}></View>;
}

const HomeScreen = () => {
  return
  (
    <View style={styles.container}>
      <Text style={styles.text}>welcome</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#573c6b',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
