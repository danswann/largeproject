const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

const directMessageController = require('../controllers/directMessage');

// Functions not using middleware
router.post('/readDM', directMessageController.readDM);
router.post('/getChat', directMessageController.getChat);

// Call middleware function
router.use(auth.jwtAuth);

// Functions using middleware
router.post('/newChat', directMessageController.newChat);
router.post('/sendMessage', directMessageController.sendMessage);
router.post('/getAllChats', directMessageController.getAllChats);
//router.post('/deleteDM', directMessageController.deleteDM);

module.exports = router;
