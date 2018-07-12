const winston = require('winston');

// Error handling middleware
module.exports = ((err, req, res, next) => {
    if (err) {
        winston.error(err.message, err);
    }

    // If exception occured, return 500 Internal server error
    return res.status(500).send('Something went wrong.');
});

// error
// warn
// info
// verbose
// debug
// silly

/* const logger = expandErrors(winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'logfile.log',
            level: 'error'
        }),
    ]
}));

function expandErrors(logger) {
    var oldLogFunc = logger.log;
    logger.log = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        if (args.length >= 2 && args[1] instanceof Error) {
            args[1] = args[1].stack;
        }
        return oldLogFunc.apply(this, args);
    };
    return logger;
} */