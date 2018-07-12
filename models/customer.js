const mongoose = require('mongoose');
const {
    ValidateResult
} = require('../helpers/validations');

// Create customer schema
const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
        trim: true
    }
}));

// Validate the customer id
const validateCustomerId = (id) => {
    if (!id) {
        return new ValidateResult(false, 'No id sent.');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return new ValidateResult(false, `Invalid customer id ${ id }.`);
    }
    return new ValidateResult(true, null);
}

// Validate the customer parameters
const validateCustomer = (customer) => {
    // Validate isGold
    if (!customer.isGold) {
        return new ValidateResult(false, 'Parameter isGold is required.');
    }

    customer.isGold = customer.isGold.trim().toLowerCase();
    if (customer.isGold !== 'true' && customer.isGold !== 'false') {
        return new ValidateResult(false, 'Invalid parameter isGold.');
    }

    // Validate name
    if (!customer.name) {
        return new ValidateResult(false, 'Parameter name is required.');
    }

    if (customer.name.length < 6 || customer.name.length > 50) {
        return new ValidateResult(false, 'Invalid parameter name (Must be at least 6 and maximum 50 characters length).');
    }

    // Validate phone
    if (!customer.phone) {
        return new ValidateResult(false, 'Parameter phone is required.');
    }

    if (customer.phone.length < 6 || customer.phone.length > 50) {
        return new ValidateResult(false, 'Invalid parameter phone (Must be at least 6 and maximum 50 characters length).');
    }
    return new ValidateResult(true, null);
};

module.exports.Customer = Customer;
module.exports.validateCustomerId = validateCustomerId;
module.exports.validateCustomer = validateCustomer;