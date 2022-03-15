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