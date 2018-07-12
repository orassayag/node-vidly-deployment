const mongoose = require('mongoose');
const {
    User,
    validateUser
} = require('../models/user');
const {
    ValidateResult
} = require('../helpers/validations');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Get current user by user token and return it.
router.get('/me', auth, async (req, res) => {

    if (!req.user || !req.user._id) {
        return res.status(500).send(`Failed to get user from token.`);
    }

    // Get the user by id without the password
    let user;
    try {
        user = await User.findById(req.user._id).select('-password -__v');
    } catch (err) {
        console.error(`Failed to get the user (id: ${req.user._id})`, err);
    }

    // Validate user from the database, if not exists, return 404 Not Found
    if (!user) {
        return res.status(404).send(`Failed to get the user (id: ${req.user._id}) from the database.`);
    }

    // Return user relevant properties
    return res.send(user);
});

// Create user and return it.
router.post('/', async (req, res) => {

    // If invalid rental parameters, return 400 Bad Request.
    const validateResult = validateRequestUser(req);
    if (!validateResult.isValid) {
        return res.status(400).send(validateResult.errorMessage);
    }

    // Check if not exists already with specific email on the database.
    let existsUser;
    try {
        existsUser = await User.findOne({
            email: req.body.email.trim()
        });
    } catch (err) {
        // If exception occurred, return 500 Internal Server Error.
        console.error('Failed to create user.', err);
        return res.status(500).send('Failed to create user.');
    }

    if (existsUser) {
        return res.status(400).send(`User with the email ${req.body.email} already exists on the database.`);
    }

    let userPassword;

    // Hash the user password
    try {
        let salt = await bcrypt.genSalt(10);
        userPassword = await bcrypt.hash(req.body.password.trim(), salt);
    } catch (err) {
        // If exception occurred, return 500 Internal Server Error.
        console.error('Failed to create user.', err);
        return res.status(500).send('Failed to create user.');
    }

    // Create the new user object.
    let user = new User({
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        password: userPassword
    });

    // Save it to the database.
    try {
        user = await user.save();
    } catch (err) {
        // If exception occurred, return 500 Internal Server Error.
        console.error('Failed to create user.', err);
        return res.status(500).send('Failed to create user.');
    }

    // Validate user saved on the database, if not, return 400 Bad Request.
    if (!user) {
        return res.status(400).send('Failed to save the user on the database.');
    }

    // After successful creation of user, create a token for the user.
    const userToken = user.generateAuthToken();

    // Return some of the user properties with a auth token.
    res.header('x-auth-token', userToken).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
});

// Validate that the request body is not empty and the request body parameters.
const validateRequestUser = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function.
    return validateUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
};

module.exports = router;