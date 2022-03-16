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

    // Check if userID is a valid object id
    for (let i = 0; i < users.length; i++)
    {
        if(!checkObjectId(users[i])) {
            response.ok = false;
            response.error = 'Invalid user id';
            res.status(200).json(response);
            return;
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
        // Otherwise return a success message
        else
        {
            response.message = 'Succesfully made new DM group!';
            res.status(200).json(response);
        }
    });
}

exports.sendMessage = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {id, text, userID} = req.body;

    // Check if post id is valid object id
    if(!checkObjectId(id)) {
        response.ok = false;
        response.error = 'Invalid post id';
        res.status(200).json(response);
        return;
    }

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        res.status(200).json(response);
        return;
    }

    // find dm by dm id
    const filter = {_id:id};
    const dm = await DirectMessage.findOne(filter);

    // add message object to chat array
    const update = {text:text,userID:userID};
    dm.chat.push(update);

    // update the message json file in database
    dm.save(function (err) {
        // If an error occurs, return ok:false and the error message
        if(err)
        {
            response.ok = false;
            response.error = err;
            res.status(200).json(response);
        }
        // Otherwise return a success message
        else
        {
            response.message = 'Succesfully sent message!';
            res.status(200).json(response);
        }
    });

}