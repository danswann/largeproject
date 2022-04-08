const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define comment subdocument schema
const CommentSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    comment: {type:String, maxlength:250, required:true},
    author: {type:Schema.ObjectId, ref:'User', required:true}
});

// Define post schema
const PostSchema = new Schema({
    isReposted: {type:Boolean, required:true, default:false},
    originalPost: {type:Schema.ObjectId, ref:'Post', default:null},
    playlistID: {type:String, required:true},
    caption: {type:String, maxlength:250},
    likedBy: [{type:Schema.ObjectId, ref:'User'}],
    comments: [{type:CommentSchema, required:true, default:()=>({})}],
    author: {type:Schema.ObjectId, ref:'User', required:true},
    timeStamp: {type:Date, default:Date.now}
});

// Export model
module.exports = mongoose.model('Post', PostSchema);
