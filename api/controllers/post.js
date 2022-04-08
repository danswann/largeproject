const Post = require('../models/post');
const Notification = require('../models/notification');
const Spotify = require('../spotify/main');
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
    const {playlistID, caption} = req.body;
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
        author: userID
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
        return res.status(200).json(response);
    }

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
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
            return res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Invalid id or cannot delete';
            return res.status(200).json(response);
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
                post: postID,
                user: post.author,
                sender: userID
            });

            // Save the new instance
            newNotification.save(function (err) {
                // If an error occurs, return ok:false and the error message
                if(err)
                {
                    response.ok = false;
                    response.error = err;
                    return res.status(200).json(response);
                }
            });

            response.action = 'post successfully liked';
            return res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'Invalid id or cannot add';
            return res.status(200).json(response);
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
    const update = {$push:{comments:{comment:comment,author:userID}}};
    const options = {new: true};
    const post = await Post.findOneAndUpdate(filter, update, options);

    // If the post exists, return ok:true
    if(post)
    {
        // Create a new instance of notification model
        var newNotification = new Notification({
            notificationType: 3,
            post: postID,
            user: post.userID,
            sender: userID
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
    const userID = req.body.userID;
    const postID = req.body.postID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        return res.status(200).json(response);
    }

    const post = await Post.deleteOne({_id:postID, userID:userID});

    // If the post exists, return ok:true
    if(post.deletedCount > 0)
    {
        response.action = 'post successfully deleted';
        res.status(200).json(response);
    }
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'Cannot delete (postID not in database)';
        res.status(200).json(response);
    }
}

exports.deleteComment = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const postID = req.body.postID;
    const commentID = req.body.commentID;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        res.status(200).json(response);
        return;
    }

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
    const update = { $pull: {comments: {_id:commentID, userID:userID}}};
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
        response.post = post.toObject();
        response.post.playlist = await Spotify.getPlaylistData(post.userID, post.playlistID);
        console.log(response.post.playlist);
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

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Check if currentIndex and numberOfPosts is given
    if (currentIndex == undefined)
    {
        currentIndex = 0;
    }
    if (numberOfPosts == undefined)
    {
        numberOfPosts = 5;
    }
    if (numberOfPosts <= 0)
    {
        response.ok = false;
        response.error = 'numberOfPosts has to be greater than 0';
        return res.status(200).json(response);
    }
    if (currentIndex < 0)
    {
        response.ok = false;
        response.error = 'currentIndex has to be greater than 0';
        return res.status(200).json(response);
    }

    // Find post by postID
    const filter = {_id: userID};
    const projection = {_id: 0, following: 1};
    const followingArray = await User.findOne(filter, projection);

    // If the post exists, return ok:true
    if(followingArray)
    {
        // Find post by author and sort them by time posted
        const filter2 = {author: followingArray.following};
        const post = await Post.find(filter2).sort({ timeStamp: 'desc'}).skip(currentIndex).limit(numberOfPosts).lean();

        if(post)
        {
            response.posts = post;
            for(p of response.posts) {
                try {
                    p.playlist = await Spotify.getPlaylistData(p.userID, p.playlistID);
                } catch(err) {
                    response.ok = false;
                    response.error = 'Could not fetch playlist with ID "' + p.playlistID + '" and author "' + p.userID + '"';
                    res.status(200).json(response);
                    return;
                }
            };
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
    const userID = req.body.userID;
    const postID = req.body.postID;
    const caption = req.body.caption;

    if (!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }
    if (!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        return res.status(200).json(response);
    }
    if (caption == null)
    {
        response.ok = false;
        response.error = 'caption null';
        return res.status(200).json(response);
    }

    const updateCaption = await Post.findOneAndUpdate({_id:postID, userID:userID},{caption:caption});

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
        response.error = 'Post not found or UserID does not match creator of post';
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
    const filter = {author:userID};
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
