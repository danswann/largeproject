const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define notifications schema
const NotificationSchema = new Schema({
    timeStamp: {type:Date, default:Date.now},
    isRead: {type:Boolean, default:false},
    notificationType: {type:Number, Min: 1, Max: 10},
    userID: {type:Schema.ObjectId, ref:'User', required:true},
    senderID: {type:Schema.ObjectId, ref:'User', required:true}
});

// Export model
module.exports = mongoose.model('Notification', NotificationSchema);
