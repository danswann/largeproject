const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaylistDataSchema = new Schema({
    _id: {type:String, required:true},
    name: {type:String, required:true},
    image: {type:String, required:true}
});

// Export model
module.exports = mongoose.model('PlaylistData', PlaylistDataSchema);
