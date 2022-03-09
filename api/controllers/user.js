exports.login = function(req, res, next) {
    var ret = {message: 'You logged in!'};
    res.status(200).json(ret);
}