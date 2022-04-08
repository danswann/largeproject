const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define settings subdocument schema
const UserSettingsSchema = new Schema({
    pushNotifications: {type:Boolean, required:true, default:true}
}, {_id:false})

// Define user schema
const UserSchema = new Schema({
    firstName: {type:String, maxlength: 50},
    lastName: {type:String, maxlength: 50},
    email: {type:String, required:true, unique:true, maxlength:100},
    phoneNumber: {type:String, maxlength:15},
    DOB: {type:Date},
    username: {type:String, required:true, unique:true, maxlength:25},
    password: {type:String, required:true},
    profileImageUrl: {type:String},
    biography: {type:String},
    dateJoined: {type:Date, default:Date.now},
    followers: [{type:Schema.ObjectId, ref:'User'}],
    following: [{type:Schema.ObjectId, ref:'User'}],
    settings: {type:UserSettingsSchema, required:true, default:()=>({})},
    isVerified: {type:Boolean, default:false},
    emailToken: {type:String},
    refreshToken: {type:String},
    spotify: {
        connected: {type:Boolean, required:true, default:false},
        id: {type:String},
        image: {type:String},
        accessToken: {type:String},
        refreshToken: {type:String},
        expiration: {type:Date}
    }
});

// Define virtual functions
UserSchema.virtual('fullName').get(function() {
    return this.firstName + " " + this.lastName;
});

// Export model
module.exports = mongoose.model('User', UserSchema);
