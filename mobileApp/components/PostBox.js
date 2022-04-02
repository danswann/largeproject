import {React, useState, useEffect} from "react";
import { Animated, Text, View, StyleSheet, Image, TouchableOpacity, FlatList, TouchableWithoutFeedback, ScrollView} from "react-native";
import SongBox from "./SongBox";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from "../constants/Info";
import CommentBox from "./CommentBox";

// COMPONENT BODY
export default function PostBox(props) {
    const [loading, setLoading] = useState(true);
    const [songsExpanded, setSongsExpanded] = useState(false);
    const [commentsExpanded, setCommentsExpanded] = useState(false);
    const [username, setUsername] = useState("");
    const [playlistTitle, setPlaylistTitle] = useState("chillin...");
    const [songCount, setSongCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const isFocused = useIsFocused();

    const [fadeAnim] = useState(new Animated.Value(0));
    useEffect(() => {
        getDataFromID()
        getPlaylist()
        setLiked(props.likedBy.find(user => user === props.myUserID))
        setLikeCount(props.likedBy.length)
        setCommentCount(props.comments.length)
    }, [isFocused]);

    //Gets user data from api
    function getDataFromID()
    {
        setLoading(true)
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userID: props.userID})
        };
        fetch(`${API_URL}/api/user/searchUser`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(!response.ok)
            {
            console.log(response.error)
            return
            }
            if(isFocused)
            {
                setLoading(false)
                Animated.timing(fadeAnim, {
                    fromValue: 0,
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                  }).start();
                setUsername(response.user.username)
            }
        })
    }

    //gets playlist data
    function getPlaylist(){
        props.playlistID
        //setPlaylistTitle()
        //setSongsCount()
    }

    //get time since posted
    function getTimeSince()
    {
        let ms = new Date().getTime() - new Date(props.timeStamp).getTime();
        let days = Math.floor(ms / (1000 * 60 * 60 * 24));
        if(days > 1)
            return days + " days ago"
        let hours = Math.floor(days * 24);
        if(hours > 1)
            return hours + " hours ago"
        let minutes = Math.floor(hours * 60);
        if(minutes > 1)
            return minutes + " minutes ago"
        return "A few moments ago"
    }

    //expands songs
    function songsTapped(){
        if(songsExpanded)
            setSongsExpanded(false)
        else
            setSongsExpanded(true)
    };
    //expands comments
    function commentsTapped(){
        if(commentsExpanded)
            setCommentsExpanded(false)
        else
            setCommentsExpanded(true)
    }
    //like post
    function likePost(){
        //does it first for instant change, then updates again if necessary
        if(liked)
            setLiked(false)
        else
            setLiked(true)
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({postID: props.postID, userID: props.myUserID})
        };
        fetch(`${API_URL}/api/post/likePost`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(!response.ok)
            {
                console.log(response.error)
                return
            }
            if(isFocused){
                if(response.action == "post successfully liked")
                    setLiked(true)
                else
                    setLiked(false)
            }
        })
    };

    

    return (
        <Animated.View style={(loading ? {display: "none"} : 
            {
                opacity: fadeAnim,
            })}>
        <View style={styles.PostContainer}>
            {/* Post Message */}     
            <View style={styles.MessageContainer}>        
                <View style={{flexDirection: 'row'}}>
                    {/* profile pic */}
                    <Image
                        source={require('../assets/images/defaultSmile.png')}
                        style={styles.ProfilePic}
                    />
                    <View style={{flexDirection: 'column', marginStart: 5, marginTop: 10, }}>
                        {/* name */}
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12, textDecorationLine: "underline"}}>{username}</Text>
                        {/* Message */}
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                            <Text style={styles.MainText}>{props.message}</Text>
                        </View>
                    </View>
                </View>
                {/* Timestamp */}
                <Text style={{color: 'white', textAlign: "right", marginTop: 10, marginRight: 20, fontSize: 11}}>{getTimeSince()}</Text>
            </View>

            {/* Playlist Info */}
            <View style={styles.PlaylistContainer}>
                {/* When songs are tapped, song list expands and can be scrolled */}
                {songsExpanded ? (
                <View style={{width:"100%", flexDirection:"row"}}>
                    <View style={{flexDirection: 'row', display: "none"}}>
                        <View style={{flexDirection: 'column', marginStart: 15, justifyContent:"space-between", marginTop: 5}}>
                            <View>
                                {/* Playlist Title */}
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, textDecorationLine: "underline"}}>{playlistTitle}</Text>

                                {/* Song Count */}
                                <Text style={{color: 'white', fontSize: 8}}>{songCount} songs</Text>
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
                ) : (
                <View style={{width:"100%", flexDirection:"row"}}>
                    <View style={{flexDirection: 'row', }}>
                        <View style={{flexDirection: 'column', marginStart: 15, justifyContent:"space-between", marginTop: 5}}>
                            <View>
                                {/* Playlist Title */}
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, textDecorationLine: "underline"}}>{playlistTitle}</Text>

                                {/* Song Count */}
                                <Text style={{color: 'white', fontSize: 8}}>{songCount} songs</Text>
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
            
            {/* Comments */}
            {(commentsExpanded ? (   
            <View style={styles.CommentsContainer}>
                {((props.comments.length == 0)  ?
                <Text style={{color: "white", marginLeft: 30, marginVertical: 10,}}>No Comments...</Text> :
                <ScrollView overScrollMode="never" style={{maxHeight: 205, marginVertical: 10}} nestedScrollEnabled={false}>
                    <FlatList
                        data={props.comments}
                        renderItem={({item}) => <CommentBox userID={item.userID} comment={item.comment} timeStamp={item.timeStamp}/>}
                        listKey={(item, index) => `_key${index.toString()}`}
                        keyExtractor={(item, index) => `_key${index.toString()}`}
                    />
                </ScrollView>   
                )}
            </View>) : <></>)}
                               
            {/* Post Buttons and Info */}
            <View style={styles.BarContainer}>
                {/* Buttons */}
                <View style={{flexDirection: 'row', alignItems: "center", marginLeft: 20}}>
                    <TouchableOpacity onPress={() => likePost()}>
                        <Ionicons style ={(liked ? { color: "#573C6B", marginRight: 20 } : { color: "white", marginRight: 20 })} name="heart" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => commentsTapped()}>
                        <Ionicons style ={(commentsExpanded ? { color: "#573C6B", marginRight: 20 } : { color: "white", marginRight: 20 })} name="chatbox" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons style ={{ color: "white", marginRight: 20 }} name="repeat" size={25} />
                    </TouchableOpacity>
                </View>
                {/* Post Info */}
                <View style={{flexDirection: 'row', alignItems: "center", marginRight: 20}}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
                            <Text style={{color: '#A57FC1', textAlign: "right", fontSize: 9}}>{likeCount}</Text>
                            <Text style={{color: 'white', textAlign: "right", fontSize: 9}}> people liked this post</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
                            <Text style={{color: '#A57FC1', textAlign: "right", fontSize: 9}}>{commentCount}</Text>
                            <Text style={{color: 'white', textAlign: "right", fontSize: 9}}> comments</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        </Animated.View>
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

    CommentsContainer: {
        backgroundColor: "#12081A",
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: 2,
        marginHorizontal: 2,
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