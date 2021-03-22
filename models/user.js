const mongoose = require('mongoose');
const { ValidateResult } = require('../helpers/validations');
const jwt = require('jsonwebtoken');
const config = require(`../config/config.${(process.env.NODE_ENV || 'development')}.json`);
const secrets = require(`../secrets/secrets.${(process.env.NODE_ENV || 'development')}.json`);

// Create a user schema.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
        trim: true
    },
    isAdmin: Boolean
});

// Add a generated token method specific for the user model class.
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, secrets[config.jwtPrivateKey], {
        expiresIn: 86400 // Expires in 24 hours.
    });
};

// Generate instances of the user with the schema.
const User = mongoose.model('User', userSchema);

// Validate the user parameters.
const validateUser = (user) => {
    // Validate name.
    if (!user.name) {
        return new ValidateResult(false, 'Parameter name is required.');
    }

    if (user.name.length < 5 || user.name.length > 100) {
        return new ValidateResult(false, 'Invalid parameter name (Must be at least 5 and maximum 100 characters length).');
    }

    // Validate email.
    const isValidEmail = validateUserEmail(user.email);
    if (!isValidEmail.isValid) {
        return isValidEmail;
    }

    // Validate password.
    const isValidPassword = validateUserPassword(user.password);
    if (!isValidPassword.isValid) {
        return isValidPassword;
    }

    return new ValidateResult(true, null);
};

const validateUserEmail = (email) => {
    // Validate email.
    if (!email) {
        return new ValidateResult(false, 'Parameter email is required.');
    }

    if (email.length < 5 || email.length > 255) {
        return new ValidateResult(false, 'Invalid parameter email (Must be at least 5 and maximum 255 characters length).');
    }

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
        return new ValidateResult(false, 'Invalid parameter email (Not an email).');
    }

    return new ValidateResult(true, null);
};

const validateUserPassword = (password) => {
    // Validate password.
    if (!password) {
        return new ValidateResult(false, 'Parameter password is required.');
    }

    if (password.length < 5 || password.length > 255) {
        return new ValidateResult(false, 'Invalid parameter password (Must be at least 5 and maximum 255 characters length).');
    }
    return new ValidateResult(true, null);
};

module.exports = {
    User: User,
    validateUser: validateUser,
    validateUserEmail: validateUserEmail,
    validateUserPassword: validateUserPassword
};