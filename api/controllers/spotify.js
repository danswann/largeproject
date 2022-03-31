const C = require('../../constants');
const SpotifyManager = require('../spotify/manager');

exports.getAuthLink = async function(req, res, next) {
    var response = {ok:true};

    const scopes = ['playlist-read-private'];
    const swa = await SpotifyManager.getHandle(req.session);
    console.log(swa);

    try {
        response.link = swa.createAuthorizeURL(scopes);
    }
    catch(err) {
        response.ok = false;
        response.error = err.name + ": " + err.message;
    }

    res.status(200).json(response);
}

exports.callback = async function(req, res, next) {
    const swa = await SpotifyManager.getHandle(req.session);
    
    const code = req.query.code;
    const response = await swa.authorizationCodeGrant(code);

    const currentUser = User.findOne({_id: session.userID}, 'spotify');
    currentUser.spotify.connected = true;
    currentUser.spotify.accessToken = response.body['access_token'];
    currentUser.spotify.refreshToken = response.body['refresh_token'];
    currentUser.spotify.expiration = Date.now() + response.body['expires_in'] * 1000;
    await currentUser.save();
    res.redirect(C.DOMAIN_ROOT + '/message/spotifyconnect?result=yes');
}