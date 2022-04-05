import {React, useState, useEffect} from "react";
import { Animated, Text, TextInput, View, StyleSheet, Image, TouchableOpacity, FlatList, TouchableWithoutFeedback, ScrollView, ActivityIndicator} from "react-native";
import SongBox from "./SongBox";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from "../constants/Info";
import CommentBox from "./CommentBox";

// COMPONENT BODY
export default function PostBox(props) {
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const [songsExpanded, setSongsExpanded] = useState(false);
    const [commentsExpanded, setCommentsExpanded] = useState(false);

    const [username, setUsername] = useState("");
    const [caption, setCaption] = useState("");
    const [timeStamp, setTimeStamp] = useState("");
    const [likedBy, setLikedBy] = useState([]);
    const [comments, setComments] = useState([]);

    const [playlistTitle, setPlaylistTitle] = useState("chillin...");
    const [songCount, setSongCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [commentInput, setCommentInput] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        getPostData()
    }, [isFocused]);
    
    async function getPostData()
    {
        setLoading(true)
        await getPostDataFromID()
        await getDataFromID()
        if (isFocused)
            setLoading(false)
    }

    //Gets post data from api
    async function getPostDataFromID()
    {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({postID: props.postID})
        };
        await fetch(`${API_URL}/api/post/getPost`, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                if(!response.ok)
                {
                    console.log(response.error)
                    return
                }
                if(isFocused)
                {   
                    setCaption(response.post.caption)
                    setCaption(response.post.caption)
                    setTimeStamp(response.post.timeStamp)
                    setLikedBy(response.post.likedBy)
                    setComments(response.post.comments)
                    setLikeCount(likedBy.length)
                    setCommentCount(comments.length)
                    setLiked(likedBy.find(user => user === props.myUserID))
                    setLikeLoading(false)
                }
            })
    }
    //Gets user data from api
    async function getDataFromID()
    {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userID: props.userID})
        };
        await fetch(`${API_URL}/api/user/searchUser`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(!response.ok)
            {
            console.log(response.error)
            return
            }
            setUsername(response.user.username)
        })
    }

    //get time since posted
    function getTimeSince()
    {
        let ms = new Date().getTime() - new Date(timeStamp).getTime();
        let days = ms / (1000 * 60 * 60 * 24)
        if(days > 1)
        {
            if(days < 2)
                return "1 day ago"
            return Math.floor(days) + " days ago"
        }
        let hours = days * 24
        if(hours > 1)
        {
            if(hours < 2)
                return "1 hour ago"
            return Math.floor(hours) + " hours ago"
        }
        let minutes = hours * 60
        if(minutes > 1)
        {
            if(minutes < 2)
                return "1 minute ago"
            return Math.floor(minutes) + " minutes ago"
        }
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
        setLikeLoading(true)
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
                {
                    setLiked(true)
                    getPostDataFromID()
                }
                else
                {
                    setLiked(false)
                    getPostDataFromID()
                }
            }
        })
    };

    //comment on post
    function makeComment(){
        if(commentInput == "")
            return
        setCommentLoading(true)
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({postID: props.postID, comment: commentInput, userID: props.myUserID})
        };
        fetch(`${API_URL}/api/post/commentOnPost`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(!response.ok)
            {
                console.log(response.error)
                return
            }
            else
            {
                setCommentInput("")
                getPostDataFromID()
                setCommentLoading(false)
            }
        })
    };
    

    return (
        <View style={styles.PostContainer}>
            {(loading ? 
            <View style={styles.EmptyContainer}>
                <ActivityIndicator size="large" color="#573C6B"/>
            </View>
            :
            <View>
            {/* Post Message */}     
            <View style={styles.MessageContainer}>  
                <TouchableOpacity onPress={() => {props.navigation.navigate({
                    name: 'OtherProfile',
                    params: { userID: props.userID },
                });}}>
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
                                <Text style={styles.MainText}>{caption}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
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
                {((comments.length == 0)  ?
                <Text style={{color: "white", marginLeft: 20, marginVertical: 10,}}>No Comments...</Text> :
                <ScrollView overScrollMode="never" style={{maxHeight: 205, }} nestedScrollEnabled={true}>
                    <Text style={{color: "white", marginLeft: 20,  marginTop: 10, fontSize: 12}}>Comments: </Text>
                    <FlatList
                        data={comments}
                        renderItem={({item}) => <CommentBox userID={item.userID} comment={item.comment} timeStamp={item.timeStamp}/>}
                        listKey={(item, index) => `_key${index.toString()}`}
                        keyExtractor={(item, index) => `_key${index.toString()}`}
                    />
                </ScrollView> 
                )}
                <View style={styles.MakeCommentContainer}>
                    <TextInput
                        value={commentInput}
                        style={styles.textInput}
                        placeholder="Add a comment..."
                        placeholderTextColor="#12081A"
                        onChangeText={(text) => setCommentInput(text)}
                        multiline={true}
                    />
                     <TouchableOpacity onPress={() => {[makeComment()]}}>
                        <View style={{marginHorizontal:10}}>
                            {(commentLoading ?  <ActivityIndicator size={25} color="#12081A"/> : <Ionicons name="arrow-forward-outline" size={25} color={"#12081A"}/>)}
                        </View>
                    </TouchableOpacity>
                </View>  
            </View>) : <></>)}
                               
            {/* Post Buttons and Info */}
            <View style={styles.BarContainer}>
                {/* Buttons */}
                <View style={{flexDirection: 'row', alignItems: "center", marginLeft: 20}}>
                    {(likeLoading ? <ActivityIndicator size={25} color="#573C6B" style={{marginRight:20}}/> :
                    <TouchableOpacity onPress={() => likePost()}>
                        <Ionicons style ={(liked ? { color: "#573C6B", marginRight: 20 } : { color: "white", marginRight: 20 })} name="heart" size={25} />
                    </TouchableOpacity>
                    )}
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
                            <Text style={{color: 'white', textAlign: "right", fontSize: 9}}> likes</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: "flex-end"}}>
                            <Text style={{color: '#A57FC1', textAlign: "right", fontSize: 9}}>{commentCount}</Text>
                            <Text style={{color: 'white', textAlign: "right", fontSize: 9}}> comments</Text>
                        </View>
                    </View>
                </View>
            </View>
            </View>
            )}
        </View>
    );
}

// COMPONENT STYLES
const styles = StyleSheet.create({
    MainText: {
        color: "white",
        fontSize: 11
    },

    EmptyContainer: {
        backgroundColor: "#12081A",
        justifyContent: "center",
        minHeight: 330,
        minWidth: "99%",
        borderRadius: 23,
        marginVertical: 2,
        marginHorizontal: 2,
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

    textInput: {
        justifyContent: "center",
        minHeight: 40,
        flex: 1,
        padding: 5,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 10,
        color: "#12081A",
        alignSelf: "center",
    },

    MakeCommentContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 25,
        marginVertical: 10,
        marginHorizontal: 20,
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