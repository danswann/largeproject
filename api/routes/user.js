const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// Functions not using middleware
router.post('/refreshToken', userController.refreshToken);
router.post('/deleteRefreshToken', userController.deleteRefreshToken);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/verifyEmail', userController.verifyEmail);
router.post('/searchUser', userController.searchUser);
router.post('/showFollowers', userController.showFollowers);
router.post('/showFollowings', userController.showFollowings);
router.post('/searchByUsername', userController.searchByUsername);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/confirmChangePassword', userController.confirmChangePassword);


// Call middleware function
router.use(auth.jwtAuth);

// Functions using middleware
router.post('/followUser', userController.followUser);
router.post('/unfollowUser', userController.unfollowUser);
router.post('/changeUsername', userController.changeUsername);
router.post('/changePassword', userController.changePassword);



module.exports = router;
