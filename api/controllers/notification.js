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

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        return res.status(200).json(response);
    }

    // Find all notifications by userID
    const filter = {user:userID};
    const allNotifications = await Notification.find(filter).populate('sender', '_id username spotify.image');

    // JSON array returned
    response.notifications = allNotifications;
    res.status(200).json(response);
}

exports.deleteAllNotifications = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // delete all notifications recieved by userID
    const filter = {user:userID};
    const notification = await Notification.deleteMany(filter);

    // return ok:true
    res.status(200).json(response);
}
