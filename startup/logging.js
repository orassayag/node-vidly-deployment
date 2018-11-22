const winston = require('winston');
require('express-async-errors');

module.exports = () => {
    // Set winston logger.
    winston.add(winston.transports.File, {
        filename: 'logfile.log'
    });

    // Subscribe to catch any exception in the application.
    process.on('uncaughtException', (err) => {
        winston.error(err.message, err);
        process.exit(1);
    });

    // Subscribe to catch any promise rejection in the application.
    process.on('unhandledRejection', (err) => {
        throw (err);
    });
};