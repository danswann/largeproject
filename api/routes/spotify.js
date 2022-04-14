const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotify');
router.post('/getauthlink', spotifyController.getAuthLink);
router.get('/callback', spotifyController.callback);
router.post('/getmyplaylists', spotifyController.getMyPlaylists);
router.post('/getplaylistdata', spotifyController.getPlaylistData);
router.post('/getPlaylistNameandImage', spotifyController.getPlaylistNameandImage);

module.exports = router;
