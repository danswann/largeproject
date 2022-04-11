const DirectMessage = require('../models/directMessage');

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

exports.newChat = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {users} = req.body;

    // Check if all userID's are a valid object id
    for (let i = 0; i < users.length; i++) {
        if(!checkObjectId(users[i])) {
            response.ok = false;
            response.error = 'Invalid userID ' + users[i];
            return res.status(200).json(response);
        }
    }

    // Create new direct message group
    var newDM = new DirectMessage({
        users: users
    });

    // Save to database
    newDM.save(function (err) {
        if(err)
        {
            response.ok = false;
            response.error = err;
            res.status(200).json(response);
        }
        // Return chatID
        else
        {
            response.dm = newDM._id;
            res.status(200).json(response);
        }
    });
}

exports.sendMessage = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const chatID = req.body.chatID;
    const text = req.body.text;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if chatID is valid object id
    if(!checkObjectId(chatID)) {
        response.ok = false;
        response.error = 'Invalid chatID ' + chatID;
        return res.status(200).json(response);
    }

    // Find DM by chatID and add new message
    const filter = {_id:chatID};
    const update = {$push: {chat: {text:text,author:userID}}};
    const projection = {chat: 1};
    const options = {projection: projection, new: true};
    const dm = await DirectMessage.findOneAndUpdate(filter, update, options);

    // If an error occurs, return ok:false and the error message
    if(dm)
    {
        response.dm = dm;
        res.status(200).json(response);
    }
    // Otherwise return ok:true
    else
    {
        response.ok = false;
        response.error = err;
        res.status(200).json(response);
    }
}

exports.readChat = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const chatID = req.body.chatID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if chatID is valid object id
    if(!checkObjectId(chatID)) {
        response.ok = false;
        response.error = 'Invalid chatID ' + chatID;
        return res.status(200).json(response);
    }

    // Find DM by ChatID
    const filter = {_id:chatID};
    const dm = await DirectMessage.findOne(filter);

    if(dm)
    {
        for(var i = 0; i < dm.chat.length; i++)
            if (dm.chat[i].author != userID)
                dm.chat[i].isRead = true;

        dm.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.error = err;
                res.status(200).json(response);
            }
            else
            {
                res.status(200).json(response);
            }
        });
    }
    else
    {
        response.ok = false;
        response.error = 'Chat not found';
        res.status(200).json(response);
    }
}

exports.getChat = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const chatID = req.body.chatID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if chatID is valid object id
    if(!checkObjectId(chatID)) {
        response.ok = false;
        response.error = 'Invalid chatID ' + chatID;
        return res.status(200).json(response);
    }

    // Find DM by chatID
    const filter = {_id:chatID, users:userID};
    const dm = await DirectMessage.findOne(filter).populate('users', '_id username profileImageUrl');

    // Return DM if found, if not return empty array
    if(dm)
    {
        response.dm = dm;
        res.status(200).json(response);
    }
    else
    {
        response.dm = [];
        res.status(200).json(response);
    }
}

exports.getAllChats = async function(req, res, next) {
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

    // Find all DMs by userID
    const filter = {users: {$elemMatch: {$eq: userID}}};
    const projection = {chat: {$slice: -1}};
    const dm = await DirectMessage.find(filter, projection).sort({'chat.timeStamp': 'desc'}).populate('users', '_id username profileImageUrl');

    // Return DM's if found, if not return empty array
    if(dm)
    {
        response.dm = dm;
        res.status(200).json(response);
    }
    else
    {
        response.dm = [];
        res.status(200).json(response);
    }
}
