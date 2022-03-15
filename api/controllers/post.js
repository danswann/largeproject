const Post = require('../models/post');

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
    const {playlistID, caption, mentionedUsers, userID} = req.body;

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
            response.message = 'Succesfully added post!';
            res.status(200).json(response);
        }
    });
}

exports.likePost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const {id, userID} = req.body;

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

    // Check if already liked
    const checkLike = await Post.find({_id:id,likedBy:{$in:[userID]}});

    // Delete a like if already liked
    if(checkLike != '')
    {
        // deleting a like
        const filter = {_id:id};
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
        const filter = {_id:id};
        const update = {$push:{likedBy:userID}};
        const post = await Post.findOneAndUpdate(filter, update);


        // If the post exists, return ok:true
        if(post)
        {
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
    const {id, comment, userID} = req.body;

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

    // find post by post id
    const filter = {_id:id};
    const post = await Post.findOne(filter);

    // add comment object to comments array
    const update = {comment:comment,userID:userID};
    post.comments.push(update);

    // update the post json file in database
    post.save(function (err) {
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
            response.message = 'Succesfully added comment!';
            res.status(200).json(response);
        }
    });
}
