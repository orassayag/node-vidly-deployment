const { Customer, validateCustomerId, validateCustomer } = require('../models/customer');
const { ValidateResult } = require('../helpers/validations');
const express = require('express');
const router = express.Router();

// Get all customers.
router.get('/', async (req, res) => {
    try {
        res.send(await Customer.find().sort('name'));
    } catch (err) {
        console.error('Failed to get all customers.', err);
    }
});

// Create a customer and return it.
router.post('/', async (req, res) => {

    // If invalid customer parameters, return 400 - Bad Request.
    const validateCustomerResult = validateRequestCustomer(req);
    if (!validateCustomerResult.isValid) {
        return res.status(400).send(validateCustomerResult.errorMessage);
    }

    // Create a new customer.
    let customer;
    try {
        customer = await new Customer({
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }).save();
    } catch (err) {
        console.error('Failed to create the customer.', err);
    }

    // Validate customer saved on the database, if not, return - 400 Bad Request.
    if (!customer) {
        return res.status(400).send('Failed to save the customer on the database.');
    }

    // Return the new customer.
    return res.send(customer);
});

// Update a customer and return it.
router.put('/:id', async (req, res) => {

    // If invalid customer Id parameter, return 400 - Bad Request.
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    // If invalid customer parameters, return 400 - Bad Request.
    const validateCustomerResult = validateRequestCustomer(req);
    if (!validateCustomerResult.isValid) {
        return res.status(400).send(validateCustomerResult.errorMessage);
    }

    // Update the existing customer.
    let customer;
    try {
        customer = await Customer.findByIdAndUpdate(req.params.id.trim(), {
            isGold: req.body.isGold,
            name: req.body.name.trim(),
            phone: req.body.phone.trim()
        }, {
            new: true
        });
    } catch (err) {
        console.error(`Failed to update the customer (Id: ${req.params.id.trim()}).`, err);
    }

    // Validate that the customer was saved on the database, if not, return 400 - Bad Request.
    if (!customer) {
        return res.status(400).send(`Failed to update the customer (Id: ${req.params.id.trim()}) on the database.`);
    }

    // Return the updated customer.
    return res.send(customer);
});

// Delete a customer and return it.
router.delete('/:id', async (req, res) => {

    // If invalid customer Id parameter, return 400 - Bad Request.
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    // Delete the customer.
    let customer;
    try {
        customer = await Customer.findByIdAndRemove(req.params.id.trim());
    } catch (err) {
        console.error(`Failed to delete the customer (Id: ${req.params.id.trim()}).`, err);
    }

    // Validate that the customer was deleted from the database, if not, return 400 - Bad Request.
    if (!customer) {
        return res.status(400).send(`Failed to delete the customer (id: ${req.params.id.trim()}) from the database.`);
    }

    // Return the deleted customer.
    return res.send(customer);
});

// Get a specific customer by an Id and return it.
router.get('/:id', async (req, res) => {

    // If invalid customer Id parameter, return 400 - Bad Request.
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    // Get the customer by Id.
    let customer;
    try {
        customer = await Customer.findById(req.params.id.trim());
    } catch (err) {
        console.error(`Failed to get the customer (Id: ${req.params.id.trim()}).`, err);
    }

    // Validate the customer from the database, if not exists, return 404 - Not Found.
    if (!customer) {
        return res.status(404).send(`Failed to get the customer (Id: ${req.params.id.trim()}) from the database.`);
    }

    // Return customer.
    return res.send(customer);
});

// Validate that the request Id is not empty and the request Id parameter.
const validateRequestId = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function.
    return validateCustomerId(req.params.id);
};

// Validate that the request body is not empty and the request body parameters.
const validateRequestCustomer = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function.
    return validateCustomer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
};

module.exports = router;