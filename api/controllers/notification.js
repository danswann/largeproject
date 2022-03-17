const Notification = require('../models/notification');

function checkObjectId (id) {
    const ObjectId = require('mongoose').Types.ObjectId;

    if(ObjectId.isValid(id)) {
        if((String)(new ObjectId(id)) === id)
        {
            return true;
        }
        return false;
    }
    else
    {
        return false;
    }
}

exports.getAllNotifications = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {userID} = req.body;

    // Check if user id is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        res.status(200).json(response);
        return;
    }

    // find dm by dm id
    const filter = {userID:userID};
    const allNotifications = await Notification.find(filter);

    if(allNotifications)
    {
        response.notifications = allNotifications;
        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        response.error = 'No notifications found for user';
        res.status(200).json(response);
    }
}

exports.deleteOneNotification = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {notificationID} = req.body;

    // Check if user id is valid object id
    if(!checkObjectId(notificationID)) {
        response.ok = false;
        response.error = 'Invalid notification id';
        res.status(200).json(response);
        return;
    }

    // find dm by dm id
    const filter = {_id:notificationID};
    const notification = await Notification.deleteOne(filter);

    if(notification.deletedCount == 1)
    {
        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        response.error = 'notification not found ' + notification.deletedCount;
        res.status(200).json(response);
    }
}

exports.deleteAllNotifications = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {userID} = req.body;

    // Check if user id is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        res.status(200).json(response);
        return;
    }

    // find dm by dm id
    const filter = {userID:userID, isRead:true};
    const notification = await Notification.deleteMany(filter);

    if(notification.deletedCount >= 1)
    {
        response.deletedCount = notification.deletedCount;
        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        response.error = 'no notifications found ' + notification.deletedCount;
        res.status(200).json(response);
    }
}
