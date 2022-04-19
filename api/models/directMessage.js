const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define chat subdocument schema
const ChatSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    text: {type:String, maxlength:250},
    author: {type:Schema.ObjectId, ref:'User', required:true}
});

// Define directMessage schema
const DMSchema = new Schema({
    chat: [{type:ChatSchema, default:()=>({})}],
    users: [{type:Schema.ObjectId, ref:'User'}]
});

// Export model
module.exports = mongoose.model('DirectMessage', DMSchema);
