const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');

// Functions not using middleware
router.post('/getPost', postController.getPost);
router.post('/getAllUsersPost', postController.getAllUsersPost);
router.post('/userLikedPosts', postController.userLikedPosts);

// Call middleware function
router.use(auth.jwtAuth);

// Functions using middleware
router.post('/newPost', postController.newPost);
router.post('/likePost', postController.likePost);
router.post('/commentOnPost', postController.commentOnPost);
router.post('/deleteComment', postController.deleteComment);
router.post('/deletePost', postController.deletePost);
// router.post('/repost', postController.repost);
router.post('/homeFeed', postController.homeFeed);
// router.post('/topPosts', postController.topPosts);

module.exports = router;
