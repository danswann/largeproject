const User = require('../models/user');
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

exports.followUser = async function(req, res, next)
{
    // Default response object
    var response = {ok:true}

    // Incoming values
    const {userID, followingID} = req.body;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid user id';
        res.status(200).json(response);
        return;
    }

    // Check if followID is a valid object id
    if(!checkObjectId(followingID)) {
        response.ok = false;
        response.error = 'Invalid following id';
        res.status(200).json(response);
        return;
    }

    // find user by user id
    const filter = {_id:userID};
    const user = await User.findOne(filter);

    if(user.following.includes(followingID))
    {
        // remove following id from following array
        const index = user.following.indexOf(followingID);
        user.following.splice(index, 1);

        user.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.errorLoc = 'Error removing following from users following array';
                response.error = err;
                res.status(200).json(response);
            }
        });

        // find following by following id
        const filter2 = {_id:followingID};
        const user2 = await User.findOne(filter2);

        // remove user id from followers array
        const index2 = user2.followers.indexOf(userID);
        user2.followers.splice(index2, 1);

        user2.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.errorLoc = 'Error removing user from following followers array';
                response.error = err;
                res.status(200).json(response);
            }
            // Otherwise return a success message
            else
            {
                response.message = 'Succesfully unfollowed user!';
                res.status(200).json(response);
            }
        });
    }
    else
    {
        // add following id to following array
        user.following.push(followingID);

        user.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.error = err;
                res.status(200).json(response);
            }
        });

        // find following by following id
        const filter2 = {_id:followingID};
        const user2 = await User.findOne(filter2);

        // add user id to followers array
        user2.followers.push(userID);

        user2.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.errorLoc = 'Error saving user to followings follower array';
                response.error = err;
                res.status(200).json(response);
            }
            // Otherwise return a success message
            else
            {
                // Create a new instance of notification model
                var newNotification = new Notification({
                    notificationType: 0,
                    userID: followingID,
                    senderID: userID
                });

                // Save the new instance
                newNotification.save(function (err) {
                    // If an error occurs, return ok:false and the error message
                    if(err)
                    {
                        response.ok = false;
                        response.errorLoc = 'Error sending notification';
                        response.error = err;
                        res.status(200).json(response);
                    }
                });

                response.message = 'Succesfully followed user!';
                res.status(200).json(response);
            }
        });
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
        response.error = 'Invalid user id';
        res.status(200).json(response);
        return;
    }

    // Check if postID is a valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid post id';
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
        response.error = 'Invalid user id';
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
        response.error = 'Invalid user id';
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