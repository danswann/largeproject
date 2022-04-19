import { React, useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { API_URL } from "../constants/Info";
import SearchResultBox from "../components/SearchResultBox";
import { useIsFocused } from "@react-navigation/native";
import TopUsersBox from "../components/TopUsersBox";

// COMPONENT BODY
export default function SearchScreen({ route, navigation }) {
  const { userID, accessToken, refreshToken } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [topUsers, setTopUsers] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: route.params.userID }),
    };
    fetch(`${API_URL}/api/user/topUsers`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          setTopUsers(response.users);
        } else {
        }
      });
  }, [isFocused]);

  //Gets user data from api
  function getResults(input) {
    if (input == "") {
      setResults([]);
      setSearching(false);
      return;
    }
    if (isFocused) setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID, username: input }),
    };
    fetch(`${API_URL}/api/user/searchByUsername`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          if (isFocused) {
            setSearching(true);
            setResults(response.user.slice(0, 5));
          }
        } else {
          if (isFocused) {
            console.log(response.error);
            setSearching(false);
            setResults([]);
          }
        }
        if (isFocused) setLoading(false);
      });
  }
  return (
    // Main container
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {/* Search field */}
        <View
          style={
            !searching || results.length == 0
              ? styles.inputView
              : styles.inputViewSearching
          }
        >
          <TextInput
            style={styles.textInput}
            placeholder="Search users"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            onChangeText={(text) => getResults(text)}
          />
        </View>
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <SearchResultBox
                username={item.username}
                image={item.profileImageUrl}
                isFollowed={item.currentUserFollows}
                followers={item.followers}
                userID={item._id}
                myUserID={userID}
                accessToken={accessToken}
                refreshToken={refreshToken}
                navigation={navigation}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        {!searching ? (
          <View
            style={{
              width: "100%",
              marginTop: 20,
              marginBottom: 130,
            }}
          >
            <Text style={styles.topUsersText}>Top Users</Text>

            <FlatList
              data={topUsers}
              initialScrollIndex={0}
              renderItem={({ item, index }) => {
                return (
                  <TopUsersBox
                    username={item.username}
                    userID={item._id}
                    myUserID={userID}
                    accessToken={accessToken}
                    // isFollowed={item.currentUserFollows}
                    followerCount={item.followers?.length}
                    isFollowed={item.currentUserFollows}
                    rank={index}
                    profilePic={item.profileImageUrl}
                    posts={item.posts}
                    navigation={navigation}
                  />
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <></>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  searchResultsContainer: {
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-around",
    backgroundColor: "#23192B",
    width: "85%",
  },

  inputView: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "#12081A",
    width: "85%",
    height: 45,
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  inputViewSearching: {
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: "#573C6B",
    backgroundColor: "#12081A",
    width: "85%",
    height: 45,
    marginTop: 40,
    flexDirection: "row",
  },

  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "white",
  },
  topUsersText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    left: "6%",
    marginBottom: 20,
  },
});
