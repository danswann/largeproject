const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define comment subdocument schema
const CommentSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    comment: {type:String, maxlength:250},
    userID: {type:Schema.ObjectId, ref:'User', required:true},
});

// Define post schema
const PostSchema = new Schema({
    isReposted: {type:Boolean, required:true, default:false},
    originalPostID: {type:Schema.ObjectId, ref:'Post', default:null},
    playlistID: {type:String, maxlength:100},
    caption: {type:String, maxlength:250},
    mentionedUsers: [{type:Schema.ObjectId, ref:'User'}],
    likedBy: [{type:Schema.ObjectId, ref:'User'}],
    comments: [{type:CommentSchema, required:true, default:()=>({})}],
    userID: {type:Schema.ObjectId, ref:'User', required:true},
    timeStamp: {type:Date, default:Date.now}
});

// Export model
module.exports = mongoose.model('Post', PostSchema);
