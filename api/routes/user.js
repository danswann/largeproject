const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/searchUser', userController.searchUser);
router.post('/followUser', userController.followUser);
router.post('/unfollowUser', userController.unfollowUser);
router.post('/bookmarkPost', userController.bookmarkPost);
router.post('/showFollowers', userController.showFollowers);
router.post('/showFollowings', userController.showFollowings);
router.post('/changeUsername', userController.changeUsername);
router.post('/changePassword', userController.changePassword);

module.exports = router;
