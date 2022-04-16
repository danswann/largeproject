const Notification = require('../models/notification');
const Spotify = require('../spotify/main');

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
    var currentIndex = req.body.currentIndex;
    var numberOfPosts = req.body.numberOfPosts;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        return res.status(200).json(response);
    }

    // Find all notifications by userID
    const filter = {user:userID};
    const allNotifications = await Notification.find(filter).sort({timeStamp: 'desc'}).populate({path: 'sender', select: '_id username profileImageUrl'}).populate({path: 'post', select: '_id author playlistID isReposted originalPost'}).populate({path: 'post', populate: {path: 'originalPost', select: '_id author playlistID'}}).skip(currentIndex).limit(numberOfPosts).lean();

    for (var i = 0; i < allNotifications.length; i++)
    {
        if (allNotifications[i].notificationType != 0)
        {
            if (allNotifications[i].post == null)
            {
                allNotifications.splice(i, 1);
                i--;
                continue;
            }
            try
            {
                if (allNotifications[i].post.isReposted == true)
                {
                    var data = await Spotify.getPlaylistNameandImage(allNotifications[i].post.originalPost.author, allNotifications[i].post.originalPost.playlistID);
                    allNotifications[i].post.image = data.image;
                }
                else
                {
                    var data = await Spotify.getPlaylistNameandImage(allNotifications[i].post.author, allNotifications[i].post.playlistID);
                    allNotifications[i].post.image = data.image;
                }
            }
            catch(err)
            {
                console.log(err);
            }
        }
    }

    // JSON array returned
    response.length = allNotifications.length;
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
