const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

// Functions not using middleware
const userController = require('../controllers/user');
router.post('/refreshToken', userController.refreshToken);
router.post('/deleteToken', userController.deleteToken);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/verifyEmail', userController.verifyEmail);

// Call middleware function
// router.use(auth.jwtAuth);

// Functions using middleware
router.post('/searchUser', userController.searchUser);
router.post('/followUser', userController.followUser);
router.post('/unfollowUser', userController.unfollowUser);
router.post('/bookmarkPost', userController.bookmarkPost);
router.post('/showFollowers', userController.showFollowers);
router.post('/showFollowings', userController.showFollowings);
router.post('/changeUsername', userController.changeUsername);
router.post('/changePassword', userController.changePassword);
router.post('/searchByUsername', userController.searchByUsername);


module.exports = router;
