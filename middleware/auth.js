const jwt = require('jsonwebtoken');
const config = require(`../config/config.${(process.env.NODE_ENV || 'development')}.json`);
const secrets = require(`../secrets/secrets.${(process.env.NODE_ENV || 'development')}.json`);

// Validate the user token.
module.exports = (req, res, next) => {
    // Check if the user token exists. If not found return 401 Unauthorized.
    const userToken = req.headers['x-auth-token'];
    if (!userToken || userToken.trim().length <= 0) {
        return res.status(401).send('Access denied. No token was provided.');
    }

    // Check if the user token is valid - return the user with the decoded
    // payload to next method. If invalid - return 400 Bad request.
    try {
        const decodedPayload = jwt.verify(userToken, secrets[config.jwtPrivateKey]);
        req.user = decodedPayload;
        if (next) {
            next();
        }
    } catch (err) {
        return res.status(400).send('Invalid token.');
    }
};