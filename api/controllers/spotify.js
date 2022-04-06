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
    const { userID } = req.body;

    // Get a SpotifyWebApi instance
    const swa = await SpotifyManager.getHandle();

    // List of Spotify API permissions required by our app
    const scopes = ['playlist-read-private', 'user-read-private', 'user-read-email'];

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

    // Use the new tokens to fetch one-time info about the user (name, picture)
    swa.setAccessToken(result.body['access_token']);
    swa.setRefreshToken(result.body['refresh_token']);
    
    // Get additional data from Spotify profile
    const me = await swa.getMe();

    // Update the current user's document to reflect that they have connected their Spotify
    // account and assign them the access and refresh tokens from Spotify
    const currentUser = await User.findOne({_id: userID}, 'spotify');
    if(currentUser) {
        currentUser.spotify.connected = true;
        currentUser.spotify.accessToken = result.body['access_token'];
        currentUser.spotify.refreshToken = result.body['refresh_token'];
        currentUser.spotify.expiration = Date.now() + result.body['expires_in'] * 1000;
        currentUser.spotify.id = me.body['id'];
        currentUser.spotify.image = me.body['images'][0]?.url;
        await currentUser.save();
        // Redirect to a success message on the main website
        res.redirect(C.DOMAIN_ROOT + '/message/spotifyconnect/success');
        return;
    }

    // Redirect to a failure message on the main website
    res.redirect(C.DOMAIN_ROOT + '/message/spotifyconnect/failure');
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
    response.playlists = [];
    var offset = 0;
    var total = 0;
    do {
        try {
            const result = await swa.getUserPlaylists(options={offset:offset, limit:50});
            response.playlists = response.playlists.concat(result.body.items.map(x => ({name:x.name, id:x.id, image:x.images[0]?.url||'http://placehold.jp/3d4070/ffffff/100x100.png?text=Local%0APlaylist'})));
            offset += 50;
            total = result.body.total;

        } catch(err) {
            response.ok = false;
            response.error = err.name + ": " + err.message;
        }

    } while(total > offset);

    // Return results
    res.status(200).json(response);
}