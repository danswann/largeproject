const C = require('../../constants');
const SpotifyManager = require('../spotify/manager');
const User = require('../models/user');

/**
 * Returns a URL that a user can visit to authorize our app to access their Spotify account
 */
exports.getAuthLink = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Save userID in very short-lived session for use with the callback from Spotify's website
    const userID = req.body?.userID;
    console.log("Test 1:");
    console.log(userID);

    // Get a SpotifyWebApi instance
    const swa = await SpotifyManager.getHandle();

    // List of Spotify API permissions required by our app
    const scopes = ['playlist-read-private'];

    // Try to generate the authorization URL
    try {
        response.link = swa.createAuthorizeURL(scopes, userID);
    }
    catch(err) {
        response.ok = false;
        response.error = err.name + ": " + err.message;
    }

    // Return results
    res.status(200).json(response);
}

/**
 * Handles the callback from Spotify's website after a user grants permissions to our app
 */
exports.callback = async function(req, res, next) {
    // Get a SpotifyWebApi instance
    const swa = await SpotifyManager.getHandle();
    
    // Use the code returned by Spotify to get tokens
    const code = req.query.code;
    const userID = req.query.state;
    const result = await swa.authorizationCodeGrant(code);

    // Update the current user's document to reflect that they have connected their Spotify
    // account and assign them the access and refresh tokens from Spotify
    console.log("Test 2");
    console.log(userID);
    const currentUser = await User.findOne({_id: userID}, 'spotify');
    currentUser.spotify.connected = true;
    currentUser.spotify.accessToken = result.body['access_token'];
    currentUser.spotify.refreshToken = result.body['refresh_token'];
    currentUser.spotify.expiration = Date.now() + result.body['expires_in'] * 1000;
    await currentUser.save();

    // Redirect to a success message on the main website
    res.redirect(C.DOMAIN_ROOT + '/message/spotifyconnect/success');
}

/**
 * Gets a list of playlist IDs and titles from the current user's Spotify account
 */
exports.getMyPlaylists = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Input userID
    const { userID } = req.body;

    // Get a SpotifyWebApi instance
    const swa = await SpotifyManager.getHandle(userID);

    // Get the current user's playlists from Spotify
    //TODO: loop to get all playlists instead of just the first 50
    try {
        const result = await swa.getUserPlaylists(options={limit:50});
        response.playlists = result.body.items.map(x => ({name: x.name, id:x.id}));
    }
    catch(err) {
        response.ok = false;
        response.error = err.name + ": " + err.message;
        console.log(err);
    }

    // Return results
    res.status(200).json(response);
}