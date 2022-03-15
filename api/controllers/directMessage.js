const DirectMessage = require('../models/directMessage');

exports.newChat = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {users} = req.body;

    var newDM = new DirectMessage({
        users: users
    });

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