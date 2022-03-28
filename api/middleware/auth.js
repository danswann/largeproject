const jwt = require('jsonwebtoken');
const config = process.env;

function jwtAuth(req, res, next) {
    var response = {ok:true};

    const token = req.body.token;
    if (token == null)
    {
        response.ok = false;
        response.error = 'token not found (null)';
        return res.status(200).json(response);
    }

    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
        {
            response.ok = false;
            response.error = err;
            return res.status(200).json(response);
        }
        req.user = user;
        next();
    });
};

module.exports = { jwtAuth };
