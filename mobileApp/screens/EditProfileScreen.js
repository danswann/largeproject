import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedbackBase,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationContainer,
  StackActions,
  useIsFocused,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfileBox from "../components/EditProfileBox";

export default function EditProfileScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const [biography, setBiography] = useState(route.params.bio);
  const [username, setUsername] = useState(route.params.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setBiography(route.params.bio);
    setUsername(route.params.username);
    setPassword("");
    setConfirmPassword("");
  }, [isFocused]);

  function submitInfo() {
    if (password.length === 0 && confirmPassword.length === 0) {
      // Dont do anything
    } else if (password != confirmPassword) {
      return "Passwords do not match";
    } else if (password.length < 6) {
      return "Password too short";
    } else {
      // API call to change password
    }

    if (username != route.params.username) {
      // API call to change username
    }

    if (biography != route.params.bio) {
      // API call to change bio
    }
    navigation.navigate("Profile");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.MainContainer}>
        <View style={styles.Header}>
          {/* back button */}
          <View style={styles.backButton}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              hitSlop={{ top: 100, bottom: 100, left: 8, right: 5 }}
            >
              <Ionicons
                style={{ color: "white", marginRight: 5 }}
                name="chevron-back-outline"
                size={25}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>
            {/* profile pic */}
            <Image
              source={require("../assets/images/defaultSmile.png")}
              style={styles.ProfilePic}
            />

            {/* display username up top */}
            <Text style={styles.nameText}>MobileUser</Text>
          </View>

          {/* done button */}
          <View style={styles.backButton}>
            <TouchableOpacity
              onPress={() => submitInfo()}
              hitSlop={{ top: 100, bottom: 100, left: 8, right: 5 }}
            >
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* edit bio field */}
        <View style={styles.bioView}>
          <TextInput
            style={styles.TextInput}
            value={biography}
            placeholderTextColor="white"
            selectionColor={"#573C6B"}
            clearButtonMode="while-editing"
            multiline={true}
            onChangeText={(editBio) => setBiography(editBio)}
          />
        </View>

        {/* edit username field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            value={username}
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            onChangeText={(username) => setUsername(username)}
          />
        </View>

        {/* edit password field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="New Password"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        {/* confirm password field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Confirm Password"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            secureTextEntry={true}
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
          />
        </View>

        {/* <FlatList>renderItem={({item}) => <EditProfileBox/>}</FlatList> */}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  Header: {
    // backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignContent: "space-between",
    alignItems: "stretch",
  },

  nameText: {
    color: "white",
    textAlign: "center",
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 25,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "white",
  },

  inputView: {
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    width: "75%",
    height: 45,
    marginBottom: 20,
  },

  bioView: {
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    width: "75%",
    height: 100,
    marginBottom: 20,
  },

  ProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 70,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  backButton: {
    paddingLeft: 5,
    paddingTop: 10,
  },

  doneButton: {
    textDecorationLine: "underline",
    color: "white",
    fontSize: 20,
    marginRight: 10,
  },
});
