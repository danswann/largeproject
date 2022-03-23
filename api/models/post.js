const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreCountSchema = new Schema({
    genreName: {type:String},
    genreCount: {type:Number}
});

const PlaylistSchema = new Schema({
    playlistName: {type:String},
    songIDs: [{type:String, maxlength:250}],
    genres: [{type:GenreCountSchema, required:true, default:()=>({})}]
});

// Define comment subdocument schema
const CommentSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    comment: {type:String, maxlength:250},
    userID: {type:Schema.ObjectId, ref:'User', required:true}
});

// Define post schema
const PostSchema = new Schema({
    isReposted: {type:Boolean, required:true, default:false},
    originalPostID: {type:Schema.ObjectId, ref:'Post', default:null},
    playlistInfo: {type:PlaylistSchema},
    caption: {type:String, maxlength:250},
    mentionedUsers: [{type:Schema.ObjectId, ref:'User'}],
    likedBy: [{type:Schema.ObjectId, ref:'User'}],
    comments: [{type:CommentSchema, required:true, default:()=>({})}],
    userID: {type:Schema.ObjectId, ref:'User', required:true},
    timeStamp: {type:Date, default:Date.now}
});

// Export model
module.exports = mongoose.model('Post', PostSchema);
