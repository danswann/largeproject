const User = require('../models/user');

exports.login = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {username, password} = req.body;

    // Attempt to find a user with matching username/password
    const user = await User.findOne({username:username, password:password}).exec();

    // If the user exists, return ok:true and the user's details
    if(user)
    {
        response.user = user.toJSON();
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'Invalid username or password';
        res.status(200).json(response);
    }
}

exports.register = async function(req, res, next)
{
    // Default response object
    var response = {ok:true}

    // Incoming values
    const {firstName, lastName, email, phoneNumber, username, password, dob} = req.body;

    // Create a new instance of User model
    var newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        DOB: dob,
        username: username,
        password: password,
        profileImageUrl: 'FILLER',
        biography: 'FILLER'
    });

    // Save the new instance
    newUser.save(function (err) {
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
            response.message = 'Succesfully added user ' + newUser.fullName + '!';
            res.status(200).json(response);
        }
    });
}
