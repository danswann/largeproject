const express = require('express');
const router = express.Router();

const directMessageController = require('../controllers/directMessage');
router.post('/newChat', directMessageController.newChat);
router.post('/sendMessage', directMessageController.sendMessage);
router.post('/readDM', directMessageController.readDM);

module.exports = router;
