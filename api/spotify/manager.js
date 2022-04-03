const SpotifyWebApi = require('spotify-web-api-node');
const C = require('../../constants');
const User = require('../models/user');

exports.getHandle = async function(userID) {
   // Create a new API handle
    var swa = new SpotifyWebApi({
        redirectUri: C.DOMAIN_ROOT + '/api/spotify/callback',
        clientId: C.SPOTIFY_CLIENT_ID,
        clientSecret: C.SPOTIFY_CLIENT_SECRET
    });

    // If the user has already connected their Spotify account, fetch their access and refresh tokens from the database
    if(userID) {
        const currentUser = await User.findById(userID, 'spotify');
        if(currentUser.spotify?.connected) {
            // If the token has expired, refresh it and update the backing document
            if(Date.now() + 5000 > currentUser.spotify.expiration) {
                const response = await swa.refreshAccessToken();
                currentUser.spotify.accessToken = response.body['access_token'];
                if(response.body['refresh_token']) currentUser.spotify.refreshToken = response.body['refresh_token'];
                currentUser.spotify.expiration = Date.now() + response.body['expires_in'] * 1000;
                await currentUser.save();
            }
            swa.setAccessToken(currentUser.spotify.accessToken);
            swa.setRefreshToken(currentUser.spotify.refreshToken);
        }
    }
    return swa;
}