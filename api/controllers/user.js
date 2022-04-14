const User = require('../models/user');
const Post = require('../models/post');
const Notification = require('../models/notification');
const Spotify = require('../spotify/main');
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
        response.accessToken = accessToken;
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
        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        response.error = 'user not found in database';
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
            response.error = 'Could not save refreshToken in database';
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

exports.register = async function(req, res, next) {
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
            if (err.keyPattern.username == 1)
            {
                response.error = "username is taken";
            }
            if (err.keyPattern.email == 1)
            {
                response.error = "email is taken";
            }

            response.ok = false;
            return res.status(200).json(response);
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
                // console.log('Email sent')
            }).catch((error) => {
                console.error(error)
            })

            res.status(200).json(response);
        }
    });
}

exports.verifyEmail = async function(req, res, next) {
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
                    response.ok = true;
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

exports.followUser = async function(req, res, next) {
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
            // Find user by userID and remove following as following user was not found
            const filterUser = {_id: userID};
            const updateUser = {$pull: {following: followingID}};
            const optionsUser = {new: true};
            const user = await User.findOneAndUpdate(filterUser, updateUser, optionsUser);

            response.ok = false;
            response.error = 'followingID not found in database';
            res.status(200).json(response);
        }
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'userID not found in database';
        res.status(200).json(response);
    }
}

exports.unfollowUser = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

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

        // If the follower exists and is updated, return ok:true
        if (user2)
        {
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'followingID not found in database';
            res.status(200).json(response);
        }
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'userID not found in database';
        res.status(200).json(response);
    }
}

exports.showFollowers = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const userID = req.body.userID;
    const targetID = req.body.targetID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if targetID is a valid object id
    if(!checkObjectId(targetID)) {
        response.ok = false;
        response.error = 'Invalid targetID ' + targetID;
        return res.status(200).json(response);
    }

    const filter = {_id:targetID};
    const target = await User.findOne(filter);

    if(target)
    {
        // Creates array of follower's objects
        var arrayFollowers = [];

        // Filters for followerID
        const filter2 = {_id:target.followers};
        const projection = {_id: 1, username: 1, profileImageUrl: 1, followers: 1};
        const user2 = await User.find(filter2, projection);

        // Loops through all followers
        for(let i = 0; i < user2.length; i++)
        {
            if (user2[i].followers.includes(userID))
            {
                arrayFollowers.push({
                    userID: user2[i]._id,
                    username: user2[i].username,
                    profileImageUrl: user2[i].profileImageUrl,
                    currentUserFollows: true
                });
            }
            else
            {
                arrayFollowers.push({
                    userID: user2[i]._id,
                    username: user2[i].username,
                    profileImageUrl: user2[i].profileImageUrl,
                    currentUserFollows: false
                });
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
    const targetID = req.body.targetID;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if targetID is a valid object id
    if(!checkObjectId(targetID)) {
        response.ok = false;
        response.error = 'Invalid targetID ' + targetID;
        return res.status(200).json(response);
    }

    const filter = {_id:targetID};
    const target = await User.findOne(filter);

    if(target)
    {
        // Creates array of following's objects with the stuff we want to return in it
        var arrayFollowings = [];

        // Filters for followingID's
        const filter2 = {_id:target.following};
        const projection = {_id: 1, username: 1, profileImageUrl: 1, followers: 1};
        const user2 = await User.find(filter2, projection);

        // Loops through all followings
        for(let i = 0; i < user2.length; i++)
        {
            if (user2[i].followers.includes(userID))
            {
                arrayFollowings.push({
                    userID: user2[i]._id,
                    username: user2[i].username,
                    profileImageUrl: user2[i].profileImageUrl,
                    currentUserFollows: true
                });
            }
            else
            {
                arrayFollowings.push({
                    userID: user2[i]._id,
                    username: user2[i].username,
                    profileImageUrl: user2[i].profileImageUrl,
                    currentUserFollows: false
                });
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
        return res.status(200).json(response);
    }

    // Searchs for single user and does not return password and refreshToken fields
    const filter = {_id: userID};
    const projection = {password: 0, refreshToken: 0};
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
        return res.status(200).json(response);
    }
    // Check if username is given
    if (username == null)
    {
        response.ok = false;
        response.error = 'username null';
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
        return res.status(200).json(response);
    }
    if (password == null)
    {
        response.ok = false;
        response.error = 'password null';
        return res.status(200).json(response);
    }

    // Searchs for single user and updates password field
    const filter = {_id: userID};
    const update = {password: password};
    const user = await User.findOneAndUpdate(filter, update);

    // If user is found return ok:true
    if(user)
    {
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

exports.forgotPassword = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const email = req.body.email;

    // Check if user exists with the email
    const filter = {email: email};
    var newPasswordToken = crypto.randomBytes(64).toString('hex');
    const update = {passwordToken: newPasswordToken};
    const user = await User.findOneAndUpdate(filter, update);

    if(user)
    {
        const msg = {
            to: user.email,
            from: 'soundlink.donotreply2@gmail.com',
            subject: 'Password Recovery Confirmation',
            text: `
                You have asked to change your password for Soundlink.
                If this wasn't you, DO NOT click the link below.
                If this was you, click the link below to allow for a password reset:
                https://cop4331-large.herokuapp.com/api/user/confirmChangePassword?token=${newPasswordToken}
            `,
            html: `
                <p>You have asked to change your password for Soundlink.</p>
                <p>If this wasn't you, DO NOT click the link below.</p>
                <p>If this was you, please click the link below to allow for a password reset:</p>
                <a href = "https://cop4331-large.herokuapp.com/api/user/confirmChangePassword?token=${newPasswordToken}">Change your password</a>
            `
        }

        // Sends the email through sendgrid
        sgMail.send(msg).then(() => {
            // console.log('Email sent')
        }).catch((error) => {
            console.error(error)
        });

        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        response.error = "User not found with email " + email;
        res.status(200).json(response);
    }
}

exports.confirmChangePassword = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    try {
        // Searches for user based on the email token provided after the link
        // Example: https://cop4331-large.herokuapp.com/api/user/confirmChangePassword?token=XXXXXXXXXXXXXXXXXXXXXXXX

        const user = await User.findOne({passwordToken: req.query.token});
        if (user) {
            // Will take in whatever the token is, find a user with that token, and will change value of "canChangePassword" to true.
            user.passwordToken = undefined;
            user.canChangePassword = true;

            await user.save(function (err) {
                if(err)
                {
                    response.ok = false;
                    response.error = err;
                    res.status(200).json(response);
                }
                else
                {
                    response.ok = true;
                    response.status = "Can now change password from within the app";
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

exports.changePasswordByEmail = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const email = req.body.email;
    const password = req.body.password;

    // Check if user exists with the email
    const filter = {email: email, canChangePassword: true};
    const update = {password: password, canChangePassword: false};
    const user = await User.findOneAndUpdate(filter, update);

    if(user)
    {
        res.status(200).json(response);
    }
    else
    {
        response.ok = false;
        res.status(200).json(response);
    }
}

exports.searchByUsername = async function(req, res, next) {
    // Default reponse object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    var partialUsername = req.body.username;
    var searchKey = new RegExp(partialUsername);

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Using $regex in order to get partial matching, 'i' option makes it case-sensitive
    var filter = {username: {$regex: searchKey, $options: 'i'}};
    const projection = {_id: 1, username: 1, profileImageUrl: 1, followers: 1};

    const userM = await User.find(filter, projection);

    var user = JSON.parse(JSON.stringify(userM));

    for (var i = 0; i < user.length; i++)
    {
        if (user[i].followers.includes(userID))
        {
            user[i].currentUserFollows = true;
        }
        else
        {
            user[i].currentUserFollows = false;
        }
        delete user[i].followers;
    }

    response.user = user;
    res.status(200).json(response);
}

exports.topUsers = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    const userProjection = {_id: 1, username: 1, profileImageUrl: 1, followers: 1};
    var listUsers = await User.find({}, userProjection).sort({followers: -1}).lean();
    listUsers = listUsers.splice(0, 10);

    for (var i = 0; i < listUsers.length; i++)
    {
        const postFilter = {author: listUsers[i]._id};
        const postProjection = {_id: 1, author: 1, playlistID: 1, likedBy: 1};
        var listPosts = await Post.find(postFilter, postProjection).sort({likedBy: -1}).lean();
        listPosts = listPosts.splice(0, 3);

        for (var j = 0; j < 3; j++) {
            try {
                var data = await Spotify.getPlaylistNameandImage(listPosts[j].author, listPosts[j].playlistID);
                listPosts[j].name = data.name;
                listPosts[j].image = data.image;
            }
            catch(err) {
                listPosts.splice(i, 1);
            }
        };
        listUsers[i].posts = listPosts;
    }

    response.users = listUsers;
    res.status(200).json(response);
}

exports.changeBio = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    const userID = req.body.userID;
    const newBio = req.body.biography;

    // Searchs for single user and updates biography field
    const filter = {_id: userID};
    const update = {biography: newBio};
    const user = await User.findOneAndUpdate(filter, update);

    // If user is found return ok:true
    if(user)
    {
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

// exports.topUsers = async function(req, res, next) {
//     // Default response object
//     var response = {ok:true}
//
//     const userProjection = {_id: 1, username: 1, profileImageUrl: 1, followers: 1};
//     var listOfUsers = await User.find({}, userProjection).sort({followers: -1}).lean();
//     listOfUsers = listOfUsers.splice(0, 10);
//
//     var userIDs = [];
//
//     for (var i = 0; i < listOfUsers.length; i++)
//         userIDs.push(listOfUsers[i]._id);
//
//     const postFilter = {author: userIDs};
//     const postProjection = {_id: 1, author: 1, playlistID: 1, likedBy: 1};
//     var listOfPosts = await Post.find(postFilter, postProjection).sort({author: 1, likedBy: -1}).lean();
//
//     for (var i = 0; i < listOfUsers.length; i++)
//     {
//         var userPosts = [];
//         var count = 0;
//         var curIndex = 0;
//         for (var j = 0; j < listOfPosts.length; j++)
//         {
//             if (listOfPosts[j].author.toString() == listOfUsers[0]._id.toString())
//             {
//                 curIndex = j;
//                 if (count < 3)
//                 {
//                     try {
//                         var data = await Spotify.getPlaylistNameandImage(listOfPosts[curIndex].author, listOfPosts[curIndex].playlistID);
//                         userPosts.push({
//                             _id: listOfPosts[curIndex]._id,
//                             name: data.name,
//                             image: data.image
//                         });
//                         count = count + 1;
//                     }
//                     catch(err) {
//                         listOfPosts.splice(0, 1);
//                     }
//                 }
//                 listOfPosts.splice(curIndex, 1);
//                 j--;
//             }
//             else
//             {
//                 continue;
//             }
//         }
//         listOfUsers[i].posts = userPosts;
//     }
//
//     response.users = listOfUsers;
//     res.status(200).json(response);
// }
