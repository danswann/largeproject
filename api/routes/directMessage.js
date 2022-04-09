const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

const directMessageController = require('../controllers/directMessage');

// Functions not using middleware
router.post('/newChat', directMessageController.newChat);


// Call middleware function
router.use(auth.jwtAuth);

// Functions using middleware
router.post('/getChat', directMessageController.getChat);
router.post('/sendMessage', directMessageController.sendMessage);
router.post('/getAllChats', directMessageController.getAllChats);
router.post('/readChat', directMessageController.readChat);
//router.post('/deleteMessage', directMessageController.deleteMessag);
//router.post('/deleteChat', directMessageController.deleteChat);

module.exports = router;
