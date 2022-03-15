const express = require('express');
const router = express.Router();

const directMessageController = require('../controllers/directMessage');
router.post('/newChat', directMessageController.newChat)

module.exports = router;
