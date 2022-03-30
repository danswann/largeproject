require("dotenv").config();

exports.PORT = process.env.PORT || 5000;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
exports.SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
