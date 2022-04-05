import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

// COMPONENT BODY
export default function EditProfileBox(props) {
    return (
      <TouchableOpacity style={{minWidth: "100%"}}>
          <View>        
              <View style={{flexDirection: 'row'}}>
                  {/* profile pic */}
                  <Image
                      source={require('../assets/images/defaultSmile.png')}
                      style={styles.ProfilePic}
                  /> 
              </View>              
          </View>
      </TouchableOpacity>
    );    
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    ProfilePic: {    
        width: 60,
        height: 60,
        borderRadius: 70,
      },
    
});