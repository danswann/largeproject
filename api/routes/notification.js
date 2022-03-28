const auth = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

// Call middleware function
// router.use(auth.jwtAuth);

// Functions using middleware
const notificationController = require('../controllers/notification');
router.post('/getAllNotifications', notificationController.getAllNotifications);
router.post('/deleteOneNotification', notificationController.deleteOneNotification);
router.post('/deleteAllNotifications', notificationController.deleteAllNotifications);
router.post('/readAllNotifications', notificationController.readAllNotifications);

module.exports = router;
