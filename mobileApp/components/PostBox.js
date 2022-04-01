import {React, useState} from "react";
import { Text, View, StyleSheet, Image, TouchableHighlight, FlatList, TouchableWithoutFeedback, ScrollView} from "react-native";
import SongBox from "../components/SongBox";
import { Ionicons } from "@expo/vector-icons";


// COMPONENT BODY
export default function PostBox(props) {
    const [expanded, setExpanded] = useState(false);
    function songsTapped(){
        if(expanded)
            setExpanded(false)
        else
            setExpanded(true)
        console.log(expanded)
    };
    return (
        <View style={styles.PostContainer}>
            {/* Post Message */}     
            <View style={styles.MessageContainer}>        
                <View style={{flexDirection: 'row'}}>
                    {/* profile pic */}
                    <Image
                        source={require('../assets/images/defaultSmile.png')}
                        style={styles.ProfilePic}
                    />
                    <View style={{flexDirection: 'column', marginStart: 15, marginTop: 5, }}>
                        {/* name */}
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12, textDecorationLine: "underline"}}>{props.name}</Text>
                        {/* Message */}
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                            <Text style={styles.MainText}>{props.message}</Text>
                        </View>
                    </View>
                </View>
                {/* Timestamp */}
                <Text style={{color: 'white', textAlign: "right", marginTop: 10, marginRight: 10, fontSize: 11}}>{props.timeStamp}</Text>
            </View>

            {/* Playlist Info */}
            <View style={styles.PlaylistContainer}>
                {/* When songs are tapped, song list expands and can be scrolled */}
                {expanded ? (
                <View style={{width:"100%", flexDirection:"row"}}>
                    <ScrollView style={{maxHeight: 205, marginVertical: 10}} nestedScrollEnabled={true}>
                        <TouchableWithoutFeedback onPress={() => {songsTapped()}}>
                            <FlatList style={styles.SongList}
                                data={[
                                    {key: 1, songCover: '../assets/images/testCover.jpg', songName: 'bouquet of balloons', songArtist: 'biosphere', songLength: '3:04'},
                                    {key: 2, songCover: '../assets/images/testCover.jpg', songName: 'The Last Song On Earth', songArtist: 'Adam Melchor, Emily Warren', songLength: '2:32'},
                                    {key: 3, songCover: '../assets/images/testCover.jpg', songName: 'Call It Fate, Call It Karma', songArtist: 'The Strokes', songLength: '1:48'},
                                    {key: 4, songCover: '../assets/images/testCover.jpg', songName: 'Nothing', songArtist: 'Bruno Major', songLength: '2:43'},
                                    {key: 5, songCover: '../assets/images/testCover.jpg', songName: 'bouquet of balloons', songArtist: 'biosphere', songLength: '3:04'},
                                    {key: 6, songCover: '../assets/images/testCover.jpg', songName: 'The Last Song On Earth', songArtist: 'Adam Melchor, Emily Warren', songLength: '2:32'},
                                    {key: 7, songCover: '../assets/images/testCover.jpg', songName: 'Call It Fate, Call It Karma', songArtist: 'The Strokes', songLength: '1:48'},
                                    {key: 8, songCover: '../assets/images/testCover.jpg', songName: 'Nothing', songArtist: 'Bruno Major', songLength: '2:43'},
                                ]}
                                renderItem={({item}) => <SongBox songCover={item.songCover} songName={item.songName} songArtist={item.songArtist} songLength={item.songLength} />}
                            />
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
                ) : (
                <View style={{width:"100%", flexDirection:"row"}}>
                    <View style={{flexDirection: 'row', }}>
                        <View style={{flexDirection: 'column', marginStart: 15, justifyContent:"space-between", marginTop: 5}}>
                            <View>
                                {/* Playlist Title */}
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, textDecorationLine: "underline"}}>{props.title}</Text>

                                {/* Song Count */}
                                <Text style={{color: 'white', fontSize: 8}}>{props.songCount} songs</Text>
                            </View>
                            {/* Playlist Image */}
                            <Image
                                source={require('../assets/images/testCover.jpg')}
                                style={styles.PlaylistPic}
                            />
                        </View>
                    </View>
                    {/* Playlist Songs */}
                    <ScrollView overScrollMode="never" style={{maxHeight: 205, marginVertical: 10}} nestedScrollEnabled={false}>
                        <TouchableWithoutFeedback onPress={() => {songsTapped()}}>
                            <FlatList style={styles.SongList}
                                data={[
                                    {key: 1, songCover: '../assets/images/testCover.jpg', songName: 'bouquet of balloons', songArtist: 'biosphere', songLength: '3:04'},
                                    {key: 2, songCover: '../assets/images/testCover.jpg', songName: 'The Last Song On Earth', songArtist: 'Adam Melchor, Emily Warren', songLength: '2:32'},
                                    {key: 3, songCover: '../assets/images/testCover.jpg', songName: 'Call It Fate, Call It Karma', songArtist: 'The Strokes', songLength: '1:48'},
                                    {key: 4, songCover: '../assets/images/testCover.jpg', songName: 'Nothing', songArtist: 'Bruno Major', songLength: '2:43'},
                                    {key: 5, songCover: '../assets/images/testCover.jpg', songName: 'bouquet of balloons', songArtist: 'biosphere', songLength: '3:04'},
                                    {key: 6, songCover: '../assets/images/testCover.jpg', songName: 'The Last Song On Earth', songArtist: 'Adam Melchor, Emily Warren', songLength: '2:32'},
                                    {key: 7, songCover: '../assets/images/testCover.jpg', songName: 'Call It Fate, Call It Karma', songArtist: 'The Strokes', songLength: '1:48'},
                                    {key: 8, songCover: '../assets/images/testCover.jpg', songName: 'Nothing', songArtist: 'Bruno Major', songLength: '2:43'},
                                ]}
                                renderItem={({item}) => <SongBox songCover={item.songCover} songName={item.songName} songArtist={item.songArtist} songLength={item.songLength} />}
                            />
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
                )}      
            </View>

            {/* Post Buttons and Info */}
            <View style={styles.BarContainer}>
                {/* Buttons */}
                <View style={{flexDirection: 'row', alignItems: "center", marginLeft: 20}}>
                    <TouchableHighlight underlayColor="#573C6B">
                        <Ionicons style ={{ color: "white", marginRight: 20 }} name="heart" size={25} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#573C6B">
                        <Ionicons style ={{ color: "white", marginRight: 20 }} name="chatbox" size={25} />
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#573C6B">
                        <Ionicons style ={{ color: "white", marginRight: 20 }} name="repeat" size={25} />
                    </TouchableHighlight>
                </View>
                {/* Post Info */}
                <View style={{flexDirection: 'row', alignItems: "center"}}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
                            <Text style={{color: '#A57FC1', textAlign: "right", fontSize: 9}}>{props.likeCount}</Text>
                            <Text style={{color: 'white', textAlign: "right", fontSize: 9}}> people liked this post</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
                            <Text style={{color: '#A57FC1', textAlign: "right", fontSize: 9}}>{props.commentCount}</Text>
                            <Text style={{color: 'white', textAlign: "right", fontSize: 9}}> comments</Text>
                        </View>
                    </View>
                </View>
                {/* Ellipsis Button */}
                <View style={{flexDirection: 'row', alignItems: "center",}}>
                    <TouchableHighlight underlayColor="#573C6B">
                        <Ionicons style={{ color: "white", marginRight: 20 }} name="ellipsis-horizontal" size={25} />
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
        fontSize: 11
    },

    PostContainer: {
        backgroundColor: "#573C6B",
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 15,
        width: "98%",
        borderRadius: 25,
    },
    
    MessageContainer: {
        
        backgroundColor: "#12081A",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
        marginHorizontal: 2,
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
    },

    ProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 70,
        marginVertical: 10,
        marginHorizontal: 10
    },
    
    PlaylistContainer: {
        backgroundColor: "#12081A",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
        marginHorizontal: 2,
    },

    PlaylistPic: {
        width: 150,
        height: 150,
        marginVertical: 10,
    },

    SongList: {
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#12081A",
    },

    BarContainer: {
        backgroundColor: "#12081A",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 45,
        marginTop: 2,
        marginBottom: 2,
        marginHorizontal: 2,
        borderBottomLeftRadius: 23,
        borderBottomRightRadius: 23,
    }
});