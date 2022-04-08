const User = require('../models/user');
const Notification = require('../models/notification');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jwt = require('jsonwebtoken');

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

exports.refreshToken = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming value
    const refreshToken = req.body.refreshToken;
    const userID = req.body.userID;

    // If refreshToken is empty, then return ok:false
    if (refreshToken == null)
    {
        response.ok = false;
        response.error = 'refreshToken not found (null)';
        return res.status(200).json(response);
    }

    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if refreshToken is in the database
    const token = await User.findOne({refreshToken:refreshToken});

    // If it is not, then return ok:false
    if (token == undefined)
    {
        response.ok = false;
        response.error = 'refreshToken not in database';
        return res.status(200).json(response);
    }

    // If refreshToken is in database, verify it's signiture
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        // If not verifable return error
        if (err)
        {
            response.ok = false;
            response.error = err;
            return res.status(200).json(response);
        }
        else if (user.userID != userID)
        {
            response.ok = false;
            response.error = 'Wrong user';
            return res.status(200).json(response);
        }
        // If verifiable, then return a newly generated access token
        const accessToken = jwt.sign({ userID: user.userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        response.userID = user.userID;
        response.token = accessToken;
        res.status(200).json(response);
    });
}

exports.deleteRefreshToken = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming value
    const userID = req.body.userID;

    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Delete refresh token from database
    const filter = {_id: userID};
    const update = {refreshToken: ""};
    const token = await User.findOneAndUpdate(filter, update);

    // If refreshToken deleted, returk ok:true
    if (token)
    {
        response.msg = 'refresh token deleted from database';
        res.status(200).json(response);
    }
    else
    {
        response.msg = 'user not found in database';
        res.status(200).json(response);
    }
}

exports.login = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const username = req.body.username;
    const password = req.body.password;

    if (username == null)
    {
        response.ok = false;
        response.error = 'username null';
        return res.status(200).json(response);
    }
    if (password == null)
    {
        response.ok = false;
        response.error = 'password null';
        return res.status(200).json(response);
    }

    // Attempt to find a user with matching username/password
    const filter = {username: username, password: password};
    const projection = {_id: 1, isVerified: 1};
    const user = await User.findOne(filter, projection);

    // If the user exists, return ok:true and the user's details
    if(user)
    {
        // Create token
        const accessToken = jwt.sign(
            {userID: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "30D",
            }
        );

        const refreshToken = jwt.sign(
            {userID: user._id},
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "364D",
            }
        );

        const filter2 = {_id: user._id};
        const update = {refreshToken: refreshToken};
        const user2 = await User.findOneAndUpdate(filter2, update, {upsert: true});

        if (user2)
        {
            response.accessToken = accessToken;
            response.refreshToken = refreshToken;
            response.user = user.toJSON();
            res.status(200).json(response);
        }
        else
        {
            response.ok = false;
            response.error = 'Could not save refresh token for some reason';
            res.status(200).json(response);
        }
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
    var response = {ok:true};

    // Required incoming values
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (email == null)
    {
        response.ok = false;
        response.error = 'email null';
        return res.status(200).json(response);
    }
    if (username == null)
    {
        response.ok = false;
        response.error = 'username null';
        return res.status(200).json(response);
    }
    if (password == null)
    {
        response.ok = false;
        response.error = 'password null';
        return res.status(200).json(response);
    }

    // Create a new instance of User model
    var newUser = new User({
        email: email,
        username: username,
        password: password,
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: false
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
            // Creates a new message json object with info of email
            const msg = {
                to: newUser.email,
                from: 'soundlink.donotreply2@gmail.com',
                subject: 'Please verify your email for Soundlink',
                text: `
                    Thank you for registering for Soundlink.
                    Please click the following link in order to verify your account:
                    https://cop4331-large.herokuapp.com/api/user/verifyEmail?token=${newUser.emailToken}
                `,
                html: `
                    <p>Thank you for registering for Soundlink.</p>
                    <p>Please click the following link in order to verify your account:</p>
                    <a href = "https://cop4331-large.herokuapp.com/api/user/verifyEmail?token=${newUser.emailToken}">Verify your account</a>
                `
            }

            // Sends the email through sendgrid
            sgMail.send(msg).then(() => {
                console.log('Email sent')
            }).catch((error) => {
                console.error(error)
            })

            res.status(200).json(response);
        }
    });
}

exports.verifyEmail = async function(req, res, next)
{
    // Default response object
    var response = {ok:true};

    try {
        // Searches for user based on the email token provided after the link
        // Example: https://cop4331-large.herokuapp.com/api/user/verifyEmail?token=XXXXXXXXXXXXXXXXXXXXXXXX

        const user = await User.findOne({emailToken: req.query.token});
        if (user) {
            // Sets the user's email token to null and verified to true if link is pressed
            user.emailToken = null;
            user.isVerified = true;

            await user.save(function (err) {
                if(err)
                {
                    response.ok = false;
                    response.error = err;
                    res.status(200).json(response);
                }
                else
                {
                    response.ok = false;
                    response.status = "Email confirmed";
                    res.status(200).json(response);
                }
            });
        }
        else
        {
            // If user not found, then error return.
            response.ok = false;
            response.error = "User not found";
            res.status(200).json(response);
        }

    } catch (err) {
        response.ok = false;
        response.error = err.message;
        res.status(200).json(response);
    }
}

exports.followUser = async function(req, res, next)
{
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const followingID = req.body.followingID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if followingID is a valid object id
    if(!checkObjectId(followingID)) {
        response.ok = false;
        response.error = 'Invalid followingID ' + followingID;
        return res.status(200).json(response);
    }

    // Find user by userID and add following to following array if it doesn't exist already
    const filterUser = {_id: userID};
    const updateUser = {$addToSet: {following: followingID}};
    const projection = {password: 0};
    const optionsUser = {projection: projection, new: true};
    const user = await User.findOneAndUpdate(filterUser, updateUser, optionsUser);

    // If the user exists
    if (user)
    {
        // Find following by followingID and add user to follower array if doesn't exist already
        const filterFollowing = {_id: followingID};
        const updateFollowing = {$addToSet: {followers: userID}};
        const optionsFollowing = {new: true};
        const user2 = await User.findOneAndUpdate(filterFollowing, updateFollowing, optionsFollowing);

        // If the follower exists and is updated, return ok:true and the user's details
        if (user2)
        {
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            // Find user by userID and remove following as its userID was not found
            const filterUser = {_id: userID};
            const updateUser = {$pull: {following: followingID}};
            const optionsUser = {new: true};
            const user = await User.findOneAndUpdate(filterUser, updateUser, optionsUser);

            response.ok = false;
            response.error = 'Following user not found or cannot be updated';
            res.status(200).json(response);
        }
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'User not found or cannot be updated';
        res.status(200).json(response);
    }
}

exports.unfollowUser = async function(req, res, next)
{
    // Default response object
    var response = {ok:true}

    // Incoming values
    const userID = req.body.userID;
    const followingID = req.body.followingID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Check if followingID is a valid object id
    if(!checkObjectId(followingID)) {
        response.ok = false;
        response.error = 'Invalid followingID ' + followingID;
        res.status(200).json(response);
        return;
    }

    // Find user by userID and remove following from following array
    const filterUser = {_id: userID};
    const updateUser = {$pull: {following: followingID}};
    const projection = {password: 0};
    const optionsUser = {projection: projection, new: true};
    const user = await User.findOneAndUpdate(filterUser, updateUser, optionsUser);

    // If the user exists
    if (user)
    {
        // Find following by followingID and remove user from follower array
        const filterFollowing = {_id: followingID};
        const updateFollowing = {$pull: {followers: userID}};
        const optionsFollowing = {new: true};
        const user2 = await User.findOneAndUpdate(filterFollowing, updateFollowing, optionsFollowing);

        // If the follower exists and is updated, return ok:true and the user's details
        if (user2)
        {
            const index = user.following.indexOf(followingID);
            user.following.splice(index, 1);
            response.user = user;
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Following user not found or cannot be updated';
            res.status(200).json(response);
        }
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'User not found or cannot be updated';
        res.status(200).json(response);
    }
}

exports.showFollowers = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const userID = req.body.userID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    const filter = {_id:userID};
    const user = await User.findOne(filter);

    if(user)
    {
        // Creates array of follower's objects with the stuff we want to return in it
        var arrayFollowers = [];

        // Loops through all followers
        for(let i = 0; i < user.followers.length; i++)
        {
            // filters for follower's id
            const filter2 = {_id:user.followers[i]}
            const user2 = await User.findOne(filter2);

            if(user2)
            {
                // Pushes all followers's infomration into the array
                arrayFollowers.push({
                    userID: user2._id,
                    username: user2.username,
                    profilePicture: user2.profileImageUrl
                });
            }
            else
            {
                response.ok = false;
                response.error = 'follower id not found ' + user.followers[i];
                return res.status(200).json(response);
            }
        }
        // Returns followers array with ok response
        response.followers = arrayFollowers;
        res.status(200).json(response);
    }
    else
    {
        // If user isnt found, return user not found
        response.ok = false;
        response.error = 'user not found';
        res.status(200).json(response);
    }
}


exports.showFollowings = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const userID = req.body.userID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    const filter = {_id:userID};
    const user = await User.findOne(filter);

    if(user)
    {
        // Creates array of following's objects with the stuff we want to return in it
        var arrayFollowings = [];

        // Loops through all followings
        for(let i = 0; i < user.following.length; i++)
        {
            // filters for following's id
            const filter2 = {_id:user.following[i]}
            const user2 = await User.findOne(filter2);

            if(user2)
            {
                // Pushes all following's infomration into the array
                arrayFollowings.push({
                    userID: user2._id,
                    username: user2.username,
                    profilePicture: user2.profileImageUrl
                });
            }
            else
            {
                response.ok = false;
                response.error = 'followering id not found ' + user.following[i];
                res.status(200).json(response);
                return;
            }
        }
        // Returns following array with ok response
        response.following = arrayFollowings;
        res.status(200).json(response);
    }
    else
    {
        // If user isnt found, return user not found
        response.ok = false;
        response.error = 'user not found';
        res.status(200).json(response);
    }
}

exports.searchUser = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const userID = req.body.userID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Searchs for single user and does not return password field
    const filter = {_id: userID};
    const projection = {password: 0};
    const user = await User.findOne(filter, projection);

    if(user)
    {
        response.user = user;
        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        response.error = 'User not found';
        res.status(200).json(response);
    }
}

exports.changeUsername = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const userID = req.body.userID;
    const username = req.body.username;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }
    if (username == null)
    {
        response.ok = false;
        response.message = 'username null';
        return res.status(200).json(response);
    }

    // Searchs for single user and only returns username field
    const filter = {_id: userID};
    const projection = {username: 1};
    const user = await User.findOne(filter, projection);

    if(user)
    {
        // Update username
        user.username = username;

        // Save user into database
        user.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.error = 'Username already exists';
                res.status(200).json(response);
            }
            // Otherwise return the username and success message
            else
            {
                response.username = username;
                response.message = 'Succesfully changed username';
                res.status(200).json(response);
            }
        });
    }
    // If userID is not found return error
    else
    {
        response.ok = false;
        response.error = 'User not found';
        res.status(200).json(response);
    }
}

exports.changePassword = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const password = req.body.password;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }
    if (password == null)
    {
        response.ok = false;
        response.message = 'password null';
        return res.status(200).json(response);
    }

    // Searchs for single user and updates password field
    const filter = {_id: userID};
    const update = {password: password};
    const user = await User.findOneAndUpdate(filter, update);

    // If user is found return message
    if(user)
    {
        response.message = 'Succesfully changed password';
        res.status(200).json(response);
    }
    // If userID is not found return error
    else
    {
        response.ok = false;
        response.error = 'User not found';
        res.status(200).json(response);
    }
}

exports.searchByUsername = async function(req, res, next) {
    // Default reponse object
    var response = {ok:true};

    // Incoming values
    var partialUsername = req.body.username;
    var searchKey = new RegExp(partialUsername);

    // Using $regex in order to get partial matching, 'i' option makes it case-sensitive
    var filter = {username: {$regex: searchKey, $options: 'i'}};
    const projection = {password: 0};

    const user = await User.find(filter, projection);

    if (user.length != 0) {
        response.user = user;
        res.status(200).json(response);
    }
    else {
        response.ok = false;
        response.error = 'No users matching field';
        res.status(200).json(response);
    }
}
