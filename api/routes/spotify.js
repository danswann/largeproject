const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotify');
router.get('/getauthlink', spotifyController.getAuthLink);
router.get('/callback', spotifyController.callback);

module.exports = router;