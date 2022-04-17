const express = require('express');
const router = express.Router();

const socketController = require('../controllers/socket');

router.ws('/chat', socketController.chat);

module.exports = router;