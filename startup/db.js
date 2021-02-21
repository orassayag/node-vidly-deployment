const config = require(`../config/config.${(process.env.NODE_ENV || 'development')}.json`);
const secrets = require(`../secrets/secrets.${(process.env.NODE_ENV || 'development')}.json`);
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = () => {
    // Connect to the database server.
    const db = secrets[config.dbConnectionString];
    console.log(db);
    mongoose.connect(db, {
        useNewUrlParser: true
    })
        .then(() => {
            winston.info(`Connected to ${db}...`);
        });
};