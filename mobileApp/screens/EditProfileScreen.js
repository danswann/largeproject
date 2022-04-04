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
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, StackActions} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfileBox from "../components/EditProfileBox";

export default function EditProfileScreen({navigation}) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>      
      <View style={styles.MainContainer}>


        <Text style={styles.nameText}>MobileUser</Text>

        {/* back button */}
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} hitSlop={{top: 100, bottom: 100, left: 8, right: 5}}>
            <Ionicons style={{ color: "white", marginRight: 5 }} name="chevron-back-outline" size={25} />
          </TouchableOpacity>
        </View>   

        {/* done button */}
        <View style={styles.backButton}>
          <TouchableOpacity 
            onPress={() => navigation.navigate("Profile")} 
            hitSlop={{top: 100, bottom: 100, left: 8, right: 5}}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>           
    

        {/* edit username field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="New Username"
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
      </View>

    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  nameText: {
    color: 'white',
    textAlign: 'center',
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

  backButton: {
    paddingLeft: 5,
    paddingTop: 10,
  },

  doneButton: {
    textDecorationLine: "underline",
    color: 'white',
    fontSize: 15,      
  },

});
