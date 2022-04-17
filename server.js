// Perform imports
const WebSocketServer = require('ws').WebSocketServer;
const app = require('./app');
const C = require('./constants.js');
const Spotify = require('./api/spotify/main');

// Create and configure MongoDB connection with mongoose
const mongoose = require('mongoose');
mongoose.connect(C.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up loop to update playlist data cache, and run once on launch
Spotify.runUpdateLoop();
setInterval(Spotify.runUpdateLoop, 60 * 60 * 1000); // 1 hour

// Begin listening on relevant port
const server = app.listen(C.PORT, () =>
{
    console.log('Server listening on port ' + C.PORT);
});