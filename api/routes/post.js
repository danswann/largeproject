const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
router.post('/newPost', postController.newPost);

module.exports = router;
