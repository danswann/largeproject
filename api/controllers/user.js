const User = require('../models/user');
const Notification = require('../models/notification');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

exports.login = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {username, password} = req.body;

    // Attempt to find a user with matching username/password
    const filter = {username: username, password: password};
    const projection = {password: 0};
    const user = await User.findOne(filter, projection);

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

    // Required incoming values
    if (req.body.email == undefined)
    {
        response.message = 'email not there!';
        res.status(200).json(response);
    }
    if (req.body.username == undefined)
    {
        response.message = 'username not there!';
        res.status(200).json(response);
    }
    if (req.body.password == undefined)
    {
        response.message = 'password not there!';
        res.status(200).json(response);
    }
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

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
                    http://localhost:5000/api/user/verifyEmail?token=${newUser.emailToken}
                `,
                html: `
                    <p>Thank you for registering for Soundlink.</p>
                    <p>Please click the following link in order to verify your account:</p>
                    <a href = "http://localhost:5000/api/user/verifyEmail?token=${newUser.emailToken}">Verify your account</a>
                `
            }

            // Sends the email through sendgrid
            sgMail.send(msg).then(() => {
                console.log('Email sent')
            }).catch((error) => {
                console.error(error)
            })

            response.message = 'Succesfully added user!';
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
    var response = {ok:true}

    // Incoming values
    const {userID, followingID} = req.body;

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
            response.user = user;
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
    const {userID, followingID} = req.body;

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

exports.bookmarkPost = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const {userID, postID} = req.body;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Check if postID is a valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    // Check if already bookmarked
    const checkBookmark = await User.find({_id:userID,bookmarks:{$in:[postID]}});

    if(checkBookmark != '')
    {
        // deleting a bookmark
        const filter = {_id:userID};
        const update = {$pull:{bookmarks:postID}};
        const user = await User.findOneAndUpdate(filter, update);

        // If the user exists, return ok:true
        if(user)
        {
            response.action = 'bookmark successfully removed';
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Invalid id or cannot remove';
            res.status(200).json(response);
        }
    }
    else
    {
        // update user with postID
        const filter = {_id:userID};
        const update = {$push:{bookmarks:postID}};
        const user = await User.findOneAndUpdate(filter, update);

        // If the user exists, return ok:true
        if(user)
        {
            response.action = 'post successfully bookmarked';
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Cannot add bookmark';
            res.status(200).json(response);
        }
    }
}

exports.showFollowers = async function(req, res, next) {
    // Default response object
    var response = {ok:true}

    // Incoming values
    const {userID} = req.body;

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
                response.error = 'follower id not found';
                res.status(200).json(response);
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
    const {userID} = req.body;

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
                response.error = 'followering id not found';
                res.status(200).json(response);
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
    const {userID} = req.body;

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
    const {userID, username} = req.body;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
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
    var response = {ok:true}

    // Incoming values
    const {userID, password} = req.body;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
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
