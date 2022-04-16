const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Notification types
// 0 - sender followed user
// 1 - sender liked users post
// 2 - sender reposted users post
// 3 - sender commented on users post

// Define notifications schema
const NotificationSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    notificationType: {type:Number, Min: 0, Max: 3},
    post: {type:Schema.ObjectId, ref:'Post', required: false},
    commentID: {type:Schema.ObjectId, ref:'Post', required: false},
    user: {type:Schema.ObjectId, ref:'User', required:true},
    sender: {type:Schema.ObjectId, ref:'User', required:true}
});

// Export model
module.exports = mongoose.model('Notification', NotificationSchema);
