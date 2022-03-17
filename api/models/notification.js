const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Notification types
// 0 - sender followed user
// 1 - sender liked users post
// 2 - sender reposted users post
// 3 - sender commented on users post
// 4 - sender post mentions user(s)

// Define notifications schema
const NotificationSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    isRead: {type:Boolean, default:false},
    notificationType: {type:Number, Min: 0, Max: 4},
    postID: {type:Schema.ObjectId, ref:'Post', required: false},
    userID: {type:Schema.ObjectId, ref:'User', required:true},
    senderID: {type:Schema.ObjectId, ref:'User', required:true}
});

// Export model
module.exports = mongoose.model('Notification', NotificationSchema);
