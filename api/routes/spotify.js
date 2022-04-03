const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotify');
router.post('/getauthlink', spotifyController.getAuthLink);
router.get('/callback', spotifyController.callback);
router.post('/getmyplaylists', spotifyController.getMyPlaylists);

module.exports = router;