import {React, useState, useEffect} from "react";
import { useIsFocused, useLinkProps } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";

import MessageBox from "../components/MessageBox";
import NotificationBox from "../components/NotificationBox";
import PostBox from "../components/PostBox";


import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, StackActions} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { API_URL } from "../constants/Info";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

export default function NotificationScreen({ route, navigation }) {
  const {userID, accessToken, refreshToken} = route.params;

  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: { fontSize: 12, color: "white" },
      tabBarIndicatorStyle: {
        backgroundColor: "white",
      },
      tabBarStyle: {
        backgroundColor: "#12081A",
      },
    }}>
      <Tab.Screen name="Notifications" component={NotificationTab} navigation={navigation} initialParams={{ myUserID: userID , accessToken: accessToken, refreshToken: refreshToken }}/>
      <Tab.Screen name="Messages" component={MessageTab} navigation={navigation} initialParams={{ myUserID: userID , accessToken: accessToken, refreshToken: refreshToken }}/>
    </Tab.Navigator>
  );
}

function NotificationTab({ route, navigation }) {
  const {myUserID, accessToken, refreshToken} = route.params;
  const [notifications, setNotifications] = useState([])

  const isFocused = useIsFocused();
  useEffect(() => {
    getNotifications()
  }, [isFocused]);

  // Gets user data from api
  function getNotifications()
  {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: myUserID, accessToken: accessToken})
    };
    fetch(`${API_URL}/api/notification/getAllNotifications`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
        console.log(response.error)
        }
        else
          setNotifications(response.notifications)
      })
  }  

  // Gets user data from api
  function clearNotifications()
  {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: myUserID, accessToken: accessToken})
    };
    fetch(`${API_URL}/api/notification/deleteAllNotifications`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
        console.log(response.error)
        }
        else
          setNotifications([])
      })
  }

  const [postVisible, setPostVisible] = useState(false);
  const [postBox, setPostBox] = useState(<></>);
  const openPost =  async (postID) => {
    setPostBox(await getPostBoxFromID(postID))
    setPostVisible(true)
  }

  function getPostBoxFromID(postID) {
    return new Promise((res, rej) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ postID: postID })
		};
		fetch(`${API_URL}/api/post/getPost`, requestOptions)
			.then((response) => response.json())
			.then((response) => {
				if (!response.ok) {
					console.log(response.error)
					res(<></>)
				}
        res(
          <PostBox 
            navigation={navigation} 
            postID={response.post._id} 
            author={response.post.author} 
            caption={response.post.caption}
            comments={response.post.comments}
            isReposted={response.post.isReposted}
            likedBy={response.post.likedBy}
            originalPostID={response.post.originalPostID}
            playlistID={response.post.playlistID} 
            timeStamp={response.post.timeStamp}
            myUserID={myUserID} 
            accessToken={accessToken} 
          />
        )
			})
    })
	}

  return (
    <View style={styles.MainContainer}>
      {(postVisible ? 
        <View style={styles.PostContainer}>
          {/* Post that was tapped*/}
          {postBox}
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setPostVisible(false)}
          >
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        </View>
        :
        <View>
          {(notifications.length == 0 ? <Text style={[styles.MainText, {fontSize: 16, marginVertical: 25}]}>There are no new notifications.</Text>
          :
          <View>
            <FlatList
              data={notifications}
              style={{minHeight:"92%"}}
              ListFooterComponent={<View style={{height:100}}/>}
              renderItem={({item}) => 
              <NotificationBox 
                myUserID={item.user}
                senderID={item.sender._id}
                postID={item.post}
                postImage={"uri"/*item.postImage*/} //fix this
                openPost={openPost}
                notificationType={item.notificationType} 
                username={item.sender.username}
                image={item.sender.profileImageUrl}
                timeStamp={item.timeStamp}
                navigation={navigation}
              />}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{top:-100, alignSelf: "center"}}>
              {/* Clear button */}
              <TouchableOpacity
                style={[styles.closeBtn, {paddingHorizontal:5}]}
                onPress={() => clearNotifications()}
              >
                <Text style={styles.btnText}>Clear notifications</Text>
              </TouchableOpacity>
            </View>
          </View>
          )}
        </View>
      )}
  </View>

  );
}

function MessageTab({ route, navigation }) {  
  const {myUserID, accessToken, refreshToken} = route.params;
  const [dmList, setdmList] = useState([]);  

  const isFocused = useIsFocused();
  useEffect(() => {
    getdmList()
  }, [isFocused]);

  // Gets user data from api
  function getdmList()
  {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userID: myUserID, accessToken: accessToken})
    };
    fetch(`${API_URL}/api/directMessage/getAllChats`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if(!response.ok)
        {
        console.log(response.error)
        }
        setdmList(response.dm)
      })
  }  
  
  return (
    <View style={styles.MainContainer}>
      {(dmList.length == 0 ? 
        <View>
          <Text style={[styles.MainText, {fontSize: 16, marginVertical: 25, textAlign: "center"}]}>{"You haven't created any chats."}</Text>
          <Text style={[styles.MainText, {fontSize: 16, color: "#A57FC1", textAlign: "center"}]}>{"Create a chat with the button below or in\na user's profile page."}</Text>
        </View>
        :
        <FlatList
          data={dmList} 
          style={{minHeight:"100%"}}
          ListFooterComponent={<View style={{height:100}}/>}
          renderItem={({item}) => 
          <MessageBox 
            myUserID={myUserID} 
            chatID={item._id} 
            users={item.users} 
            messages={item.chat} 
            accessToken={accessToken} 
            navigation={navigation}
          />}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {/* create new message button */}
      {/*  onPress={() => navigation.navigate("Notification")} */}
      <View style={styles.newMessageButton}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NewChat");            
          }}>
          <View style= {{backgroundColor:"#573C6B", width: 54, height: 54, borderRadius:27, justifyContent: "center", alignItems: "center"}}>
            <Ionicons style={{ color: "white", borderStyle: "solid" }} name="create-outline" size={25} />            
          </View>            
        </TouchableOpacity>
      </View>        

    </View>
  );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  MainText: {
    color: "white",
  },

  MessageContainer: {
    backgroundColor: "#23192B",
    flexDirection: "row",
    justifyContent: 'space-between',
    marginStart: 10,
    marginEnd: 10,
    marginTop: 15,
  },

  ProfilePic: {    
    width: 60,
    height: 60,
    borderRadius: 70,
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

  newMessageButton: {
    alignSelf: "flex-end",
    marginEnd: 20,
    top: -80
  },

  PostContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height:"60%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#23192B",
  },

  btnText: {
    fontSize: 15,
    marginHorizontal: 10,
    color: "white",
  },

  closeBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#573C6B",
  },

});
