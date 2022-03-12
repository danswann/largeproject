const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
router.post('/login', userController.login);
router.post('/register', userController.register);

const postController = require('../controllers/post');

const notificationController = require('../controllers/notification');

const directMessageController = require('../controllers/directMessage');

module.exports = router;
