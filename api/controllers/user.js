// require('express');
// require('mongodb');

exports.login = function(app, client) {
    app.post('/api/user/login', async (req, res, next) =>
    {
        // incoming: username, password
        // outgoing: id, objectId, fullname error

        var error = '';

        const {username, password} = req.body;

        const db = client.db();
        const results = await db.collection('users').find({username:username,password:password}).toArray();

        res.status(200).json(results[0]);
    });
}
