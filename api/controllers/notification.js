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
        return res.status(200).json(response);
    }

    // find all notifications by user id
    const filter = {user:userID};
    const allNotifications = await Notification.find(filter).populate('sender');

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

    // delete all notifications recieved by userID
    const filter = {user:userID};
    const notification = await Notification.deleteMany(filter);

    // If one or more notifications were deleted return the count
    if(notification.deletedCount >= 1)
    {
        res.status(200).json(response);
    }
    // otherwise return no notifications found
    else
    {
        response.ok = false;
        res.status(200).json(response);
    }
}
