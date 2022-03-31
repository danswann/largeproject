const SpotifyWebApi = require('spotify-web-api-node');
const C = require('../../constants');
const User = require('../models/user');

var table = {};

exports.getHandle = async function(session) {
    const sid = session.id;
    // Create a new API handle if none exists for the current session
    if(!table[sid]) {
        table[sid] = new SpotifyWebApi({
            redirectUri: C.DOMAIN_ROOT + '/api/spotify/callback',
            clientId: C.SPOTIFY_CLIENT_ID,
            clientSecret: C.SPOTIFY_CLIENT_SECRET
        });
    }
    // If the user has already connected their Spotify account, fetch their access and refresh tokens from the database
    const currentUser = User.findOne({_id: session.userID}, 'spotify');
    if(currentUser.spotify?.connected) {
        // If the token has expired, refresh it and update the backing document
        if(Date.now() + 5000 > currentUser.spotify.expiration) {
            const response = await table[sid].refreshAccessToken();
            currentUser.spotify.accessToken = response.body['access_token'];
            if(response.body['refresh_token']) currentUser.spotify.refreshToken = response.body['refresh_token'];
            currentUser.spotify.expiration = Date.now() + response.body['expires_in'] * 1000;
            await currentUser.save();
        }
        table[sid].setAccessToken(currentUser.spotify.accessToken);
        table[sid].setRefreshToken(currentUser.spotify.refreshToken);
    }
    return table[sid];
}