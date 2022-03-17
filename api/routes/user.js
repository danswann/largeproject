const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
router.post('/login', userController.login);
router.post('/register', userController.register);
// router.post('/searchUser', userController.searchUser);
router.post('/followUser', userController.followUser);

module.exports = router;
