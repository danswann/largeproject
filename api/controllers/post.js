const Post = require('../models/post');
const Notification = require('../models/notification');
const User = require('../models/user');

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

exports.newPost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {playlistID, caption, mentionedUsers} = req.body;
    const userID = req.user.userID;

    // Check if mentionedUsers[i] is a valid object id
    for (let i = 0; i < mentionedUsers.length; i++)
    {
        if(!checkObjectId(mentionedUsers[i])) {
            response.ok = false;
            response.error = 'Invalid mentionedUsers id at i = ' + i + ' userID ' + mentionedUsers[i];
            res.status(200).json(response);
            return;
        }
    }

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Create a new instance of post model
    var newPost = new Post({
        playlistID: playlistID,
        caption: caption,
        mentionedUsers: mentionedUsers,
        userID: userID
    });

    // Save the new instance
    newPost.save(function (err) {
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
            // Add notification to database for each mentioned user
            for (let i = 0; i < mentionedUsers.length; i++)
            {
                // Create a new instance of notification model
                var newNotification = new Notification({
                    notificationType: 4,
                    postID: newPost._id,
                    userID: mentionedUsers[i],
                    senderID: userID
                });

                // Save the new instance
                newNotification.save(function (err) {
                    // If an error occurs, return ok:false and the error message
                    if(err)
                    {
                        response.ok = false;
                        response.error = err;
                        res.status(200).json(response);
                    }
                });
            }
            response.msg = req.user;
            response.message = 'Succesfully added post!';
            res.status(200).json(response);
        }
    });
}

exports.likePost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {postID, userID} = req.body;

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Check if already liked
    const checkLike = await Post.find({_id:postID,likedBy:{$in:[userID]}});

    // Delete a like if already liked
    if(checkLike != '')
    {
        // deleting a like
        const filter = {_id:postID};
        const update = {$pull:{likedBy:userID}};
        const post = await Post.findOneAndUpdate(filter, update);

        // If the post exists, return ok:true
        if(post)
        {
            response.action = 'post successfully unliked';
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Invalid id or cannot delete';
            res.status(200).json(response);
        }
    }
    // Add a like to the post if the user has not already liked
    else
    {
        // update post with user ID
        const filter = {_id:postID};
        const update = {$push:{likedBy:userID}};
        const post = await Post.findOneAndUpdate(filter, update);

        // If the post exists, return ok:true
        if(post)
        {
            // Create a new instance of notification model
            var newNotification = new Notification({
                notificationType: 1,
                postID: postID,
                userID: post.userID,
                senderID: userID
            });

            // Save the new instance
            newNotification.save(function (err) {
                // If an error occurs, return ok:false and the error message
                if(err)
                {
                    response.ok = false;
                    response.error = err;
                    res.status(200).json(response);
                }
            });

            response.action = 'post successfully liked';
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Invalid id or cannot add';
            res.status(200).json(response);
        }
    }
}

exports.commentOnPost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {postID, comment, userID} = req.body;

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // find post by post id
    const filter = {_id:postID};
    const update = {$push:{comments:{comment:comment,userID:userID}}};
    const options = {new: true};
    const post = await Post.findOneAndUpdate(filter, update, options);

    // If the post exists, return ok:true
    if(post)
    {
        // Create a new instance of notification model
        var newNotification = new Notification({
            notificationType: 3,
            postID: postID,
            userID: post.userID,
            senderID: userID
        });

        // Save the new instance into database
        newNotification.save(function (err) {
            // If an error occurs, return ok:false and the error message
            if(err)
            {
                response.ok = false;
                response.error = err;
                res.status(200).json(response);
            }
        });

        response.post = post;
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'PostID does not exist in database';
        res.status(200).json(response);
    }
}

exports.deletePost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {postID} = req.body;

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    const post = await Post.deleteOne({_id:postID});

    // If the post exists, return ok:true
    if(post)
    {
        // Removes post from users' bookmark array
        const filter = {};
        const update = {$pullAll:{bookmarks:[postID]}};
        const user = await User.updateMany(filter, update);

        if (user)
        {
            response.action = 'post successfully deleted';
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Invalid user id or cannot remove from bookmarks';
            res.status(200).json(response);
        }
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'Invalid id or cannot delete';
        res.status(200).json(response);
    }
}

exports.deleteComment = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {postID, commentID} = req.body;

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    // Check if commentID is a valid object id
    if(!checkObjectId(commentID)) {
        response.ok = false;
        response.error = 'Invalid commentID ' + commentID;
        res.status(200).json(response);
        return;
    }

    // find post by postID
    const filter = {_id:postID};
    const update = { $pull: {comments: {_id:commentID}}};
    const options = {new: true};
    const post = await Post.findOneAndUpdate(filter, update, options);

    // If the post exists, return ok:true
    if(post)
    {
        response.post = post;
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'PostID does not exist in database';
        res.status(200).json(response);
    }
}

exports.getPost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {postID} = req.body;

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    // Find post by postID
    const filter = {_id:postID};
    const post = await Post.findOne(filter);

    // If the post exists, return ok:true
    if(post)
    {
        response.post = post;
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'PostID does not exist in database';
        res.status(200).json(response);
    }
}

exports.homeFeed = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    var currentIndex = req.body.currentIndex;
    var numberOfPosts = req.body.numberOfPosts;
    let defaultIndex = false;
    let defaultNumberOfPosts = false;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Check if currentIndex and numberOfPosts is given
    if (currentIndex == undefined)
    {
        defaultIndex = true;
        currentIndex = 0;
    }
    if (numberOfPosts == undefined)
    {
        defaultNumberOfPosts = true;
        numberOfPosts = 5;
    }
    if (numberOfPosts <= 0)
    {
        response.ok = false;
        response.error = 'numberOfPosts has to be greater than 0';
        res.status(200).json(response);
        return;
    }
    // Find post by postID
    const filter = {_id: userID};
    const projection = {_id: 0, following: 1};
    const followingArray = await User.findOne(filter, projection);

    // If the post exists, return ok:true
    if(followingArray)
    {
        // Find post by postID
        const filter2 = {userID: followingArray.following};
        const post = await Post.find(filter2).sort({ timeStamp: 'desc'}).skip(currentIndex).limit(numberOfPosts);

        if(post)
        {
            if (defaultIndex == true && defaultNumberOfPosts == true)
            {
                response.message = 'currentIndex was defaulted to 0 and numberOfPosts was defaulted to 5';
            }
            else if (defaultIndex == true)
            {
                response.message = 'currentIndex was defaulted to 0';
            }
            else if (defaultNumberOfPosts == true)
            {
                response.message = 'numberOfPosts was defaulted to 5';
            }
            response.length = post.length;
            response.posts = post;
            res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'No post found';
            res.status(200).json(response);
        }
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'User not found';
        res.status(200).json(response);
    }
}

exports.editCaption = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {postID, caption} = req.body;

    if (!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        res.status(200).json(response);
        return;
    }

    const updateCaption = await Post.findOneAndUpdate({_id:postID},{caption:caption});

    // If the post exists and the caption was updates, return ok:true
    if (updateCaption)
    {
        response.action = 'caption successfully updated';
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'Invalid id or cannot edit caption';
        res.status(200).json(response);
    }
}

exports.getAllUsersPost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

    // Find post by userID
    const filter = {userID:userID};
    const posts = await Post.find(filter);

    // If the post exists, return ok:true
    if(posts)
    {
        response.post = posts;
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'No posts made by UserID or error';
        res.status(200).json(response);
    }
}
