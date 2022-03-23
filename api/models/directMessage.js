const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define chat subdocument schema
const ChatSchema = new Schema({
    isRead: {type:Boolean, default:false},
    timeStamp: {type:Date, default:Date.now},
    containsEmbed: {type:Boolean, default:false},
    playlistID: {type:String, required:false},
    postID: {type:Schema.ObjectId, ref:'Post', required:false},
    text: {type:String, maxlength:250},
    userID: {type:Schema.ObjectId, ref:'User', required:true}
});

// Define directMessage schema
const DMSchema = new Schema({
    chat: [{type:ChatSchema, default:()=>({})}],
    users: [{type:Schema.ObjectId, ref:'User'}]
});

// Export model
module.exports = mongoose.model('DirectMessage', DMSchema);
