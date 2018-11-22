const config = require(`./config/config.${(process.env.NODE_ENV || 'development')}.json`);
const winston = require('winston');
const express = require('express');
const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')(config);
require('./startup/prod')(app);

// Listen to the server.
const port = process.env.PORT || 3000;
module.exports = app.listen(port, () => {
    winston.info(`Listening to port ${port}...`);
    winston.info(`Server on ${process.env.NODE_ENV} environment...`);
});