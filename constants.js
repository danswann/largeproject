require("dotenv").config();

exports.PORT = process.env.PORT || 5000;
exports.DOMAIN_ROOT = process.env.DOMAIN_ROOT || 'http://localhost:5000';
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
exports.SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
exports.EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET
