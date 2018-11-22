const winston = require('winston');

// Error handling middleware.
module.exports = ((err, req, res, next) => {
    if (err) {
        winston.error(err.message, err);
    }

    // If exception occurred, return 500 Internal server error.
    return res.status(500).send('Something went wrong.');
});