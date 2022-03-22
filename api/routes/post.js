const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
router.post('/newPost', postController.newPost);
router.post('/getPost', postController.getPost);
router.post('/likePost', postController.likePost);
router.post('/commentOnPost', postController.commentOnPost);
router.post('/deleteComment', postController.deleteComment);
router.post('/deletePost', postController.deletePost);
// router.post('/postFeed', postController.postFeed);
// router.post('/topPosts', postController.topPosts);

module.exports = router;
