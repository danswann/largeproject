const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notification');

// Call middleware function
router.use(auth.jwtAuth);

// Functions using middleware
router.post('/getAllNotifications', notificationController.getAllNotifications);
router.post('/deleteAllNotifications', notificationController.deleteAllNotifications);

module.exports = router;
