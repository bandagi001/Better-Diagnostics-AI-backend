
var jwt = require('jsonwebtoken');
const { createResponse } = require('./response');

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return createResponse(res, 'error', `Unauthorized, please provide valid token`);
    }
    const bearer = token.split(' ')[1];
    jwt.verify(bearer, 'tokenveryverysecretkey', (err, user) => {
        if(err) return createResponse(res, 'error', err);
        req.user = JSON.parse(user.data);
        next();
    });
};