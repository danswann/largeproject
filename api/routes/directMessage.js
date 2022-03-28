const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

// Call middleware function
// router.use(auth.jwtAuth);

// Functions using middleware
const directMessageController = require('../controllers/directMessage');
router.post('/newChat', directMessageController.newChat);
router.post('/sendMessage', directMessageController.sendMessage);
router.post('/readDM', directMessageController.readDM);
router.post('/getDM', directMessageController.getDM);
router.post('/getAllDMs', directMessageController.getAllDMs);
//router.post('/deleteDM', directMessageController.deleteDM);

module.exports = router;
