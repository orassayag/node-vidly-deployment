const { User, validateUserEmail, validateUserPassword } = require('../models/user');
const { ValidateResult } = require('../helpers/validations');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Login the user to the system.
router.post('/', async (req, res) => {

    // If invalid rental parameters, return 400 - Bad Request.
    const validateResult = validateRequestAuthUser(req);
    if (!validateResult.isValid) {
        return res.status(400).send(validateResult.errorMessage);
    }

    // Check if exists with a specific email on the database.
    let user;
    try {
        user = await User.findOne({
            email: req.body.email.trim()
        });
    } catch (err) {
        // If exception occurred, return 500 - Internal Server Error.
        return res.status(500).send('Failed to auth user.');
    }

    if (!user) {
        return res.status(400).send('Invalid user email or password.');
    }

    // Check if the password is valid.
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
        return res.status(400).send('Invalid user email or password.');
    }

    // After successful authentication create a token for the user and return it.
    const userToken = user.generateAuthToken();
    res.send(userToken);
});

// Validate that the request body is not empty and the request body parameters.
const validateRequestAuthUser = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Validate email.
    const isValidEmail = validateUserEmail(req.body.email);
    if (!isValidEmail.isValid) {
        return isValidEmail;
    }

    // Validate password.
    const isValidPassword = validateUserPassword(req.body.password);
    if (!isValidPassword.isValid) {
        return isValidPassword;
    }
    return new ValidateResult(true, null);
};

module.exports = router;