const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define settings subdocument schema
const RefreshTokenSchema = new Schema({
    refreshToken: {type:String, required:true}
});

// Export model
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
