import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthenticatedScreen from "./screens/AuthenticatedScreen";
import { AuthContext } from "./Context";
import UnauthenticatedScreen from "./screens/UnauthenticatedScreen";
import { API_URL } from "./constants/Info";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";

const LoggedInStack = createNativeStackNavigator();

export default function App() {
  
  // Initial state
  const initialLoginState = {
    isLoading: true,
    currentState: null,
    userID: null,
    userVerified: false,
    refreshToken: null,
    accessToken: null,
  };

  const getHashedPassword = (password) => {
    let hash = new Promise((res, rej) => {
    JSHash(password, CONSTANTS.HashAlgorithms.sha256)
      .then((hash) => {
        res(hash)
      })
    })
    return hash
  }

  //If user is logged out, deletes refresh token from database
  async function deleteRefreshToken()
  {
    const userID = await getUserID()
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userID: userID}),
    };
    fetch(`${API_URL}/api/user/deleteRefreshToken`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(!data.ok)
        {
          console.log("deleteRefresh error:" + data.error)
        }
        else
          dispatch({ type: "LOGOUT" });
      })
  }
  
  //When user logs in, needed data from login saved in cache
  const cacheData = async (id, token) => {
    try {
      await AsyncStorage.setItem("userID", id)
      await AsyncStorage.setItem("refreshToken", token)
    } catch (error) {
      console.log("cacheData error:" + error)
    }
  };

  //returns refresh token from cache
  const getRefreshToken = async () => {
    try {
      return await AsyncStorage.getItem("refreshToken")
    } catch (error) {
      console.log(error)
    }
  };

  //returns refresh token from cache
  const getUserID = async () => {
    try {
      return await AsyncStorage.getItem("userID")
    } catch (error) {
    }

  };

  // Reducer function
  const loginReducer = (prevState, action) => {
    console.log("State is " + action.type)
    switch (action.type) {
      case "LOGGEDIN":
        return {
          ...prevState,
          userID: action.userID,
          refreshToken: action.refresh,
          accessToken: action.access,
          currentState: action.type,
          isLoading: false,
        };
      case "NOTLOGGEDIN":
        return {
          ...prevState,
          currentState: action.type,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userID: null,
          refreshToken: null,
          accessToken: null,
          userVerified: false,
          currentState: action.type,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userVerified: null,
          currentState: action.type,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  // Context functions that can change the authentication status of the user
  const authContext = React.useMemo(() => {
    return {
      signIn: async (username, password) => {
        const hashedPassword = await getHashedPassword(password)
        const promise = new Promise((res, rej) => {
          
          // User ID will store the users unique id
          let userID;
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: hashedPassword }),
          };
          console.log(JSON.stringify({ username: username, password: hashedPassword }))
          fetch(`${API_URL}/api/user/login`, requestOptions)
            .then((response) => response.json())
            .then( async (data) => {
              // data.ok and userVerified will be true if a valid user is attempting to log in
              if (data.ok === true ) {
                if(data.user.isVerified) {
                  userID = data.user._id;
                  cacheData(userID, data.refreshToken)
                  dispatch({ type: "LOGGEDIN", userID: userID, refresh: data.refreshToken, access: data.accessToken });
                }
                res(false);
              } else {
                console.log("Invalid username or password");
                res(true);
              }
            })
            .catch(() => {
              console.log("Api error: Server is probably down")
              res(false)
            })
        })
        return promise;
      },
      signUp: async (
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        dob
      ) => {
        // Object that specifies what we need for the request since it is a POST
        const hashedPassword = await getHashedPassword(password)
        console.log("Sign up is hashing as " + hashedPassword)
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: hashedPassword,
            dob: dob,
          }),
        };
        fetch(`${API_URL}/api/user/register`, requestOptions)
          .then((response) => response.text())
          .then((data) => {
            if(!data.ok)
              console.log(data)
          }
          );
      },
      signOut: () => {
        deleteRefreshToken()
      },
      refresh: (userID, refreshToken) => {
        return new Promise((res, rej) => {
          if(refreshToken == null)
            res(false)
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userID: userID, refreshToken: refreshToken}),
          };
          fetch(`${API_URL}/api/user/refreshToken`, requestOptions)
            .then((response) => response.json())
            .then(async (data) => {
              if(!data.ok)
              {
                console.log("refresh error: " + data.error)
                dispatch({ type: "NOTLOGGEDIN"});
                res(false)
              }
              res(data.token)
            })
            .catch(() => {console.log("Api error: Server is probably down")})
        })
      }
    };
  }, []);

  // Set the buffer time for the loading screen (only occurs on first opening the app)
  React.useEffect(() => {
    setTimeout( async () => {
      const userID = await getUserID()
      const refreshToken = await getRefreshToken()
      let accessToken = null;
      if(refreshToken != null)
        accessToken = await authContext.refresh(userID, refreshToken)
      if(accessToken == null)
        dispatch({ type: "NOTLOGGEDIN"});
      else 
        dispatch({ type: "LOGGEDIN", userID: userID, refresh: refreshToken, access: accessToken });
    }, 1000);
  }, []);

  // Show the loading circle while we retrieve whether the users logged in status
  if (loginState.isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}
      >
        <ActivityIndicator size="large" color="#573C6B" />
      </View>
    );
  }
  return (
    // Use authcontext provider to track the users authentication status across the whole app
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        { /* Transitions to authenticated screen once user data is valid*/}
        {(loginState.userID != null && loginState.accessToken != null) ? (
          <LoggedInStack.Navigator screenOptions={{ headerShown: false }}>
            <LoggedInStack.Screen
              name="Authenticated"
              component={AuthenticatedScreen}
              initialParams={{userID: loginState.userID, accessToken: loginState.accessToken, refreshToken: loginState.refreshToken}}
            />
          </LoggedInStack.Navigator>
        ) : (
          <UnauthenticatedScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
