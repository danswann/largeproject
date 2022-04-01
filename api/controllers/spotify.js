const C = require('../../constants');
const SpotifyManager = require('../spotify/manager');

/**
 * Returns a URL that a user can visit to authorize our app to access their Spotify account
 */
exports.getAuthLink = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Get the SpotifyWebApi instance associated with this session
    const swa = await SpotifyManager.getHandle(req.session);

    // List of Spotify API permissions required by our app
    const scopes = ['playlist-read-private'];

    // Try to generate the authorization URL
    try {
        response.link = swa.createAuthorizeURL(scopes);
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
    // Get the SpotifyWebApi instance associated with this session
    const swa = await SpotifyManager.getHandle(req.session);
    
    // Use the code returned by Spotify to get tokens
    const code = req.query.code;
    const result = await swa.authorizationCodeGrant(code);

    // Update the current user's document to reflect that they have connected their Spotify
    // account and assign them the access and refresh tokens from Spotify
    const currentUser = User.findOne({_id: session.userID}, 'spotify');
    currentUser.spotify.connected = true;
    currentUser.spotify.accessToken = result.body['access_token'];
    currentUser.spotify.refreshToken = result.body['refresh_token'];
    currentUser.spotify.expiration = Date.now() + result.body['expires_in'] * 1000;
    await currentUser.save();

    // Redirect to a success message on the main website
    res.redirect(C.DOMAIN_ROOT + '/message/spotifyconnect?result=yes');
}

/**
 * Gets a list of playlist IDs and titles from the current user's Spotify account
 */
exports.getMyPlaylists = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Get the SpotifyWebApi instance associated with this session
    const swa = await SpotifyManager.getHandle(req.session);

    // Get the current user's playlists from Spotify
    //TODO: loop to get all playlists instead of just the first 50
    try {
        const result = await swa.getUserPlaylists(options={limit:50});
        response.playlists = result.body.items.map(x => ({name: x.name, id:x.id}));
    }
    catch(err) {
        response.ok = false;
        response.error = err.name + ": " + err.message;
    }

    // Return results
    res.status(200).json(results);
}