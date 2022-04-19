const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define user schema
const UserSchema = new Schema({
    email: {type:String, required:true, unique:true, maxlength:100},
    username: {type:String, required:true, unique:true, maxlength:25},
    password: {type:String, required:true},
    profileImageUrl: {type:String},
    biography: {type:String},
    dateJoined: {type:Date, default:Date.now},
    numFollowers: {type:Number, default: 0},
    followers: [{type:Schema.ObjectId, ref:'User'}],
    following: [{type:Schema.ObjectId, ref:'User'}],
    isVerified: {type:Boolean, default:false},
    emailToken: {type:String},
    refreshToken: {type:String},
    passwordToken: {type:String},
    canChangePassword: {type:Boolean, default:false},
    spotify: {
        connected: {type:Boolean, required:true, default:false},
        id: {type:String},
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
