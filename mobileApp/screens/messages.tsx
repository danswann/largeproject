import React from 'react';

import { View, Text, Button, StyleSheet } from 'react-native';
import { Text, View } from "../components/Themed";

import { RootTabScreenProps } from "../types";
import EditScreenInfo from "../components/EditScreenInfo";

// export default function Messages({ navigation }: RootTabScreenProps<"Home">) {
//     return <View style={styles.container}></View>;
// }

const messageScreen = ({navigation}) => {
    return (
        <View style={StyleSheet.container}>
            <Text>Messages</Text>
            <button
                title="click here"
                onProgress={() => alert('button clicked!')}                
            />
        </View>
    );
}

export default messageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '573c6b'
    },
});