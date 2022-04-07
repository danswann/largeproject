const jwt = require('jsonwebtoken');
const config = process.env;

function jwtAuth(req, res, next) {
    var response = {ok:true};

    const accessToken = req.body.accessToken;

    if (accessToken == null)
    {
        response.ok = false;
        response.error = 'access token null';
        return res.status(200).json(response);
    }

    jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
        {
            response.ok = false;
            response.error = err;
            return res.status(200).json(response);
        }
        else if (user.userID != req.body.userID)
        {
            response.ok = false;
            response.error = 'access token does not belong to this user';
            return res.status(200).json(response);
        }

        delete req.body.accessToken;
        next();
    });
};

module.exports = { jwtAuth };
