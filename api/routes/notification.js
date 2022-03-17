const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notification');
router.post('/getAllNotifications', notificationController.getAllNotifications);
router.post('/deleteOneNotification', notificationController.deleteOneNotification);
router.post('/deleteAllNotifications', notificationController.deleteAllNotifications);
router.post('/readAllNotifications', notificationController.readAllNotifications);

module.exports = router;
