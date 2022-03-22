import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";


const Tab = createMaterialTopTabNavigator();

// test data
const data = [
  {key: '1', name: 'sebastian', message: 'whats up guyys'},
  {key: '2', name: 'roberto', message: 'nice playlist'},
  {key: '3', name: 'will', message: 'hey'},
  {key: '4', name: 'doug', message: 'whats todays date?'},
  {key: '5', name: 'daniel', message: 'how is todays weather'},
];

function MessagesList() {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => <MessageTab data={item} />}
    />
  );
}

export default function NotificationScreen() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: { fontSize: 12, color: "white" },
      tabBarIndicatorStyle: {
        backgroundColor: "white",
      },
      tabBarStyle: {
        backgroundColor: "#573C6B",
      },
    }}>
      <Tab.Screen name="Notifications" component={NotificationTab} />
      <Tab.Screen name="Messages" component={MessageTab} />
    </Tab.Navigator>
  );
}

function NotificationTab() {
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.MainText}>View Your Notifications!</Text>
    </View>
  );
}

function MessageTab({data}) {
  return (
    <TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: 'space-between',
            marginStart: 10,
            marginEnd: 10,
            marginTop: 15,
          }}>
          
          <View style={{flexDirection: 'row'}}>

            <Image
              source={{uri: 'https://picsum.photos/600'}}
              style={{width: 60, height: 60, borderRadius: 70}}
            />

            <View style={{flexDirection: 'column', marginStart: 15}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {data.name}
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: colors.textFaded2}}>
                  {data.message}
                </Text>

                <Image
                  source={require('../assets/images/defaultSmile.png')}
                  style={{width: 3, height: 3, marginStart: 5}}
                />

                <Text style={{color: colors.textFaded2, marginStart: 5}}>2h</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity>
            <View>
              <Image
                source={require('../assets/images/defaultSmile.png')}
                style={{width: 25, height: 25}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  MainText: {
    color: "white",
  },

  Button: {
    backgroundColor: "#573c6b",
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
  },

  ButtonText: {
    color: "white",
  },

  tabs: {

  }
});
