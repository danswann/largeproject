const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
router.post('/newPost', postController.newPost);
router.post('/likePost', postController.likePost);
router.post('/commentOnPost', postController.commentOnPost);

module.exports = router;
