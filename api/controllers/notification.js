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
    const userID = req.body.userID;

    // Check if user id is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        res.status(200).json(response);
        return;
    }

    // find all notifications by user id
    const filter = {userID:userID};
    const allNotifications = await Notification.find(filter);

    // JSON array returned
    if(allNotifications)
    {
        response.notifications = allNotifications;
        res.status(200).json(response);
    }
    // Nothing returned
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
    const userID = req.body.userID;
    const notificationID = req.body.notificationID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Check if notificationID is valid object id
    if(!checkObjectId(notificationID)) {
        response.ok = false;
        response.error = 'Invalid notificationID ' + notificationID;
        res.status(200).json(response);
        return;
    }

    // delete notification with given notification id
    const filter = {_id:notificationID, userID:userID};
    const notification = await Notification.deleteOne(filter);

    // If notification deleted then return ok
    if(notification.deletedCount == 1)
    {
        response.acknowledged = notification.acknowledged;
        response.deletedCount = notification.deletedCount;
        res.status(200).json(response);
    }
    // Otherwise return ok = false, notification not found
    else
    {
        response.ok = false;
        response.acknowledged = notification.acknowledged;
        response.deletedCount = notification.deletedCount;
        response.error = 'notification not found';
        res.status(200).json(response);
    }
}

exports.deleteAllNotifications = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;

    // Check if user id is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // delete all notifications recieved by userID and isRead = true
    const filter = {userID:userID, isRead:true};
    const notification = await Notification.deleteMany(filter);

    // If one or more notifications were deleted return the count
    if(notification.deletedCount >= 1)
    {
        response.acknowledged = notification.acknowledged;
        response.deletedCount = notification.deletedCount;
        res.status(200).json(response);
    }
    // otherwise return no notifications found
    else
    {
        response.ok = false;
        response.acknowledged = notification.acknowledged;
        response.deletedCount = notification.deletedCount;
        response.error = 'no notifications found';
        res.status(200).json(response);
    }
}

exports.readAllNotifications = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Find notifications of user that are not read and update it to read
    const filter = {userID:userID, isRead:false};
    const update = {isRead:true};
    const notification = await Notification.updateMany(filter, update);

    // If notification(s) were updated to read then ok:true
    if(notification.modifiedCount >= 1)
    {
        response.acknowledged = notification.acknowledged;
        response.modifiedCount = notification.modifiedCount;
        res.status(200).json(response);
    }
    // If no notifications were updated then ok:false
    else
    {
        response.ok = false;
        response.acknowledged = notification.acknowledged;
        response.modifiedCount = notification.modifiedCount;
        response.error = 'no notifications found';
        res.status(200).json(response);
    }
}
