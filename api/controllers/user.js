exports.login = function(req, res, next) {
    const {login, password} = req.body;
    var ret = {message: 'You tried to login as ' + login + '!'};
    res.status(200).json(ret);
}