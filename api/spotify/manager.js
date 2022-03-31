const SpotifyWebApi = require('spotify-web-api-node');
const C = require('../../constants');
const User = require('../models/user');

var table = {};

exports.getHandle = async function(session) {
    const sid = session.id;
    if(!table[sid]) {
        const currentUser = User.findOne({_id: session.userID}, 'spotify.accessToken spotify.refreshToken');
        table[sid] = SpotifyWebApi({
            redirectUri: C.DOMAIN_ROOT + '/api/spotify/callback',
            clientId: C.SPOTIFY_CLIENT_ID,
            clientSecret: C.SPOTIFY_CLIENT_SECRET
        });
        table[sid].setAccessToken(currentUser.spotify.accessToken);
        table[sid].setRefreshToken(currentUser.spotify.refreshToken);
    }
    return table[sid];
}