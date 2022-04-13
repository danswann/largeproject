import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "../constants/Info";
import NewMessageBox from "../components/NewMessageBox";
import SearchResultBox from "../components/SearchResultBox";
import { Ionicons } from "@expo/vector-icons";

export default function NewMessageScreen({ navigation }) {
    return (
      <View style={styles.MainContainer}>
        {/* Go back button */}
        <View style={styles.Header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.BackButton}
          >
            <Ionicons
              style={{ color: "white", marginRight: 5 }}
              name="chevron-back-outline"
              size={25}
            />
          </TouchableOpacity>
          <Text style={styles.MainText}>New Message</Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    MainText: {
      color: "white",
      fontSize: 20,
    },
    MainContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#23192B",
    },
    BackButton: {
      position: "absolute",
      left: "2%",
      height: 100,
      width: 100,
    },
    Header: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: "row",
      alignSelf: "stretch",
      justifyContent: "center",
      position: "relative",
    },
  });