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
import { API_URL } from "../constants/Info";

export default function EditProfileScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const [biography, setBiography] = useState(route.params.bio);
  const [username, setUsername] = useState(route.params.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(<Text></Text>);

  useEffect(() => {
    setBiography(route.params.bio);
    setUsername(route.params.username);
    setPassword("");
    setConfirmPassword("");
    setErrorMessage(<Text></Text>);
  }, [isFocused]);

  async function submitInfo() {
    if (password.length === 0 && confirmPassword.length === 0) {
      // Dont do anything
    } else if (password != confirmPassword) {
      setErrorMessage(
        <Text style={{ color: "red" }}>Passwords do not match</Text>
      );
      return;
    } else if (password.length < 6) {
      setErrorMessage(
        <Text style={{ color: "red" }}>
          Password must be at least 6 characters long
        </Text>
      );
      return;
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: route.params.myUserID,
          password: password,
          accessToken: route.params.accessToken,
        }),
      };
      await fetch(`${API_URL}/api/user/changePassword`, requestOptions);
    }

    if (username === route.params.username) {
    } else if (username.length < 6) {
      setErrorMessage(
        <Text style={{ color: "red" }}>
          Username must be at least 6 characters long
        </Text>
      );
      return;
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: route.params.myUserID,
          username: username,
          accessToken: route.params.accessToken,
        }),
      };
      await fetch(`${API_URL}/api/user/changeUsername`, requestOptions);
    }
    if (biography.length > 69) {
      setErrorMessage(
        <Text style={{ color: "red" }}>Bio can be up to 69 characters</Text>
      );
      return;
    } else if (biography === route.params.bio) {
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: route.params.myUserID,
          biography: biography,
          accessToken: route.params.accessToken,
        }),
      };
      let response = await fetch(
        `${API_URL}/api/user/changeBio`,
        requestOptions
      );
      let reponseJSON = JSON.stringify(response);
      console.log(reponseJSON);
    }
    navigation.navigate("Profile");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.MainContainer}>
        <View style={{backgroundColor: "#12081A", width:"100%", flexDirection: "row", justifyContent:"space-between"}}>
          {/* back button */}
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <View style={{margin: 15, width: 25, height: 25}}>
              <Ionicons style={{ color: "white", marginRight: 5 }} name="chevron-back-outline" size={25} />
            </View>            
          </TouchableOpacity>
          {/* name on top */}
          <Text style={{color: "white", alignSelf: "center", fontSize:15}}>EDIT PROFILE</Text>  
          {/*Spacer*/}
          <View style={{margin: 15, width: 25, height: 25}}/>
        </View>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {/* edit username field */}
          <View style={{width:"75%"}}>
            <Text style={styles.mainText}>Username:</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                value={username}
                placeholder="Enter a new Username..."
                placeholderTextColor="white"
                clearButtonMode="while-editing"
                selectionColor={"#573C6B"}
                maxLength={18}
                onChangeText={(username) => setUsername(username)}
              />
            </View>
          </View>

          {/* edit bio field */}
          <View style={{width:"75%"}}>
            <Text style={styles.mainText}>Profile Biography:</Text>
            <View style={styles.bioView}>
              <TextInput
                style={[styles.TextInput, {textAlignVertical: "top"}]}
                value={biography}
                placeholder="Type your biography here..."
                placeholderTextColor="white"
                selectionColor={"#573C6B"}
                clearButtonMode="while-editing"
                multiline={true}
                onChangeText={(editBio) => setBiography(editBio)}
              />
            </View>
          </View>
          <View style={{width:"75%"}}>
            <Text style={styles.mainText}>Change Password:</Text>
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
          </View>
          {/* done button */}
            <TouchableOpacity
              style = {styles.doneButton}
              onPress={() => submitInfo()}
              hitSlop={{ top: 100, bottom: 100, left: 8, right: 5 }}
            >
              <Text style={styles.doneText}>Apply changes</Text>
            </TouchableOpacity>     
          <View>{errorMessage}</View>
        </View>
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  nameText: {
    color: "white",
    textAlign: "center",
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 25,
  },

  mainText: {
    color: "white",
    textAlign: "left",
    alignSelf: "flex-start",
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 13,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    color: "white",
  },

  inputView: {
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    width: "100%",
    height: 45,
    marginBottom: 20,
  },

  bioView: {
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    width: "100%",
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
    borderRadius: 25,
    backgroundColor: "#573C6B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginVertical: 10
  },

  doneText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});
