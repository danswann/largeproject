import React from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";

// COMPONENT BODY
export default function SearchScreen() {
  return (
    // Main container
    <View style={styles.container}>
      {/* Search field */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Search posts"
          placeholderTextColor="#573C6B"
        />
      </View>
      <View style={styles.searchResultsContainer}>
        
      </View>
    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
  },

  searchResultsContainer: {
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-around",
    backgroundColor: "black",
  },

  searchResult: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "space-around",
    backgroundColor: "gray",
  },

  inputView: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "white",
    width: "75%",
    height: 45,
    marginBottom: 20,
    marginVertical: 40,
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "black"
  }
});
