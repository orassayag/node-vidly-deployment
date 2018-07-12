const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = () => {
    // Set winston logger
    winston.add(winston.transports.File, {
        filename: 'logfile.log'
    });

    // Subscribe to catch any exception in the application
    process.on('uncaughtException', (err) => {
        winston.error(err.message, err);
        process.exit(1);
    });

    // Subscribe to catch any promise rejection in the application
    process.on('unhandledRejection', (err) => {
        throw (err);
    });
};

/* winston.handleExceptions(
    new winston.transports.File({
        filename: 'uncaughtException.log'
    })
)
 */

//Set winston logger to mongodb
/* winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost:27017/vidly',
    level: 'error'
}); */