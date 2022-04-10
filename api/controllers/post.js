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
    const userID = req.body.userID;
    const playlistID = req.body.playlistID;
    const caption = req.body.caption;

    // Check if userID is a valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }

    // Create a new instance of post model
    var newPost = new Post({
        playlistID: playlistID,
        caption: caption,
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
            response.postID = newPost._id;
            res.status(200).json(response);
        }
    });
}

exports.likePost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const postID = req.body.postID;

    // Check if userID is a valid object id
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

    // Check if already liked
    const checkLike = await Post.find({_id:postID,likedBy:{$in:[userID]}});

    // Delete a like if already liked
    if(checkLike != '')
    {
        // Deleting the like
        const filter = {_id:postID};
        const update = {$pull:{likedBy:userID}};
        const projection = {likedBy: 1};
        const options = {projection: projection, new: true};
        const post = await Post.findOneAndUpdate(filter, update, options);

        // If the postID exists, return ok:true
        if(post)
        {
            // Delete postID field as it's unnecessary
            var retPost = JSON.parse(JSON.stringify(post));
            delete retPost._id;

            response.post = retPost;
            return res.status(200).json(response);
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'PostID does not exist in database';
            return res.status(200).json(response);
        }
    }
    // Add a like to the post if the user has not already liked
    else
    {
        // Add the like; adds userID to likedBy array
        const filter = {_id:postID};
        const update = {$push:{likedBy:userID}};
        const projection = {author: 1, likedBy: 1};
        const options = {projection: projection, new: true};
        const post = await Post.findOneAndUpdate(filter, update, options);

        // If the postID exists, return ok:true
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
                else
                {
                    // Delete postID and author fields as it's unnecessary
                    var retPost = JSON.parse(JSON.stringify(post));
                    delete retPost._id;
                    delete retPost.author;

                    response.post = retPost;
                    return res.status(200).json(response);
                }
            });
        }
        // Otherwise return ok:false and the error message
        else
        {
            response.ok = false;
            response.error = 'PostID does not exist in database';
            return res.status(200).json(response);
        }
    }
}

exports.commentOnPost = async function(req, res, next) {
    // Default response object
    var response = {ok:true};

    // Incoming values
    const userID = req.body.userID;
    const postID = req.body.postID;
    const comment = req.body.comment;

    // Check if userID is a valid object id
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

    // Find post by postID and add comment object to comments array
    const filter = {_id:postID};
    const update = {$push:{comments:{comment:comment,author:userID}}};
    const projection = {author: 1, comments: 1};
    const options = {projection: projection, new: true};
    const post = await Post.findOneAndUpdate(filter, update, options);

    // If the postID exists, return ok:true
    if(post)
    {
        // Create a new instance of notification model
        var newNotification = new Notification({
            notificationType: 3,
            post: postID,
            user: post.author,
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
            else
            {
                // Delete postID and author fields as it's unnecessary
                var retPost = JSON.parse(JSON.stringify(post));
                delete retPost._id;
                delete retPost.author;

                response.post = retPost;
                res.status(200).json(response);
            }
        });
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
        return res.status(200).json(response);
    }

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        return res.status(200).json(response);
    }

    // Check if commentID is a valid object id
    if(!checkObjectId(commentID)) {
        response.ok = false;
        response.error = 'Invalid commentID ' + commentID;
        return res.status(200).json(response);
    }

    // find post by postID
    const filter = {_id:postID};
    const update = { $pull: {comments: {_id:commentID, author:userID}}};
    const projection = {author: 1, comments: 1};
    const options = {projection: projection, new: true};
    const post = await Post.findOneAndUpdate(filter, update, options);

    // If the post exists, return ok:true
    if(post)
    {
        // Delete postID and author fields as it's unnecessary
        var retPost = JSON.parse(JSON.stringify(post));
        delete retPost._id;
        delete retPost.author;

        response.post = retPost;
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
    const postID = req.body.postID;

    // Check if postID is valid object id
    if(!checkObjectId(postID)) {
        response.ok = false;
        response.error = 'Invalid postID ' + postID;
        return res.status(200).json(response);
    }

    // Find post by postID
    const filter = {_id:postID};
    const post = await Post.findOne(filter);
    // .populate('originalPost')

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
    if (currentIndex == undefined || currentIndex < 0)
    {
        currentIndex = 0;
    }
    if (numberOfPosts == undefined || numberOfPosts <= 0)
    {
        numberOfPosts = 5;
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
        const post = await Post.find(filter2).sort({ timeStamp: 'desc'}).populate('author comments.author', '_id username profileImageUrl').skip(currentIndex).limit(numberOfPosts).lean();

        if(post)
        {
            response.posts = post;
            for (var i = 0; i < response.posts.length; i++) {
                try {
                    response.posts[i].playlist = await Spotify.getPlaylistData(response.posts[i].author, response.posts[i].playlistID);
                }
                catch(err) {
                    response.posts.splice(i, 1);
                    // response.ok = false;
                    // response.error = 'Could not fetch playlist with ID "' + p.playlistID + '" and author "' + p.author + '"';
                    // return res.status(200).json(response);
                }
            };
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
    // Otherwise return ok:false and the error message
    else
    {
        response.ok = false;
        response.error = 'UserID does not exist in database';
        res.status(200).json(response);
    }
}

exports.getAllUsersPost = async function(req, res, next) {
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
    if (currentIndex == undefined || currentIndex < 0)
    {
        currentIndex = 0;
    }
    if (numberOfPosts == undefined || numberOfPosts <= 0)
    {
        numberOfPosts = 5;
    }

    // Find liked posts by userID
    const filter = {author:userID};
    const projection = {_id: 1, author: 1, playlistID: 1};
    const posts = await Post.find(filter, projection).skip(currentIndex).limit(numberOfPosts).lean();

    response.posts = posts;
    for (var i = 0; i < response.posts.length; i++) {
        try {
            data = await Spotify.getPlaylistData(response.posts[i].author, response.posts[i].playlistID);
            response.posts[i].name = data.name;
            response.posts[i].image = data.image;
        }
        catch(err) {
            response.posts.splice(i, 1);
            // response.ok = false;
            // response.error = 'Could not fetch playlist with ID "' + p.playlistID + '" and author "' + p.author + '"';
            // return res.status(200).json(response);
        }
    };
    res.status(200).json(response);
}

exports.userLikedPosts = async function(req, res, next) {
    // Default reponse object
    var response = {ok:true};

    var userID = req.body.userID;
    var currentIndex = req.body.currentIndex;
    var numberOfPosts = req.body.numberOfPosts;

    // Check if userID is valid object id
    if(!checkObjectId(userID)) {
        response.ok = false;
        response.error = 'Invalid userID ' + userID;
        return res.status(200).json(response);
    }
    // Check if currentIndex and numberOfPosts is given
    if (currentIndex == undefined || currentIndex < 0)
    {
        currentIndex = 0;
    }
    if (numberOfPosts == undefined || numberOfPosts <= 0)
    {
        numberOfPosts = 5;
    }

    // Find liked posts by userID
    const filter = {likedBy: {$elemMatch: {$eq: userID}}};
    const projection = {_id: 1, author: 1, playlistID: 1};
    const posts = await Post.find(filter, projection).skip(currentIndex).limit(numberOfPosts).lean();

    response.posts = posts;
    for (var i = 0; i < response.posts.length; i++) {
        try {
            data = await Spotify.getPlaylistData(response.posts[i].author, response.posts[i].playlistID);
            response.posts[i].name = data.name;
            response.posts[i].image = data.image;
        }
        catch(err) {
            response.posts.splice(i, 1);
            // response.ok = false;
            // response.error = 'Could not fetch playlist with ID "' + p.playlistID + '" and author "' + p.author + '"';
            // return res.status(200).json(response);
        }
    };
    res.status(200).json(response);
}
