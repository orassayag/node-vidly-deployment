const { Rental,validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { ValidateResult } = require('../helpers/validations');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const router = express.Router();

Fawn.init(mongoose);

// Get all rentals.
router.get('/', async (req, res) => {
    try {
        res.send(await Rental.find()
            .populate('Customer', 'name')
            .populate('Movie', 'title')
            .sort('rentalDate'));
    } catch (err) {
        console.error('Failed to get all rentals.', err);
    }
});

// Create rental and return it.
router.post('/', async (req, res) => {

    //If invalid rental parameters, return 400 Bad Request.
    const validateRentalResult = validateRequestRental(req);
    if (!validateRentalResult.isValid) {
        return res.status(400).send(validateRentalResult.errorMessage);
    }

    // Get the movie of the rental by the id.
    const movie = await Movie.findById(req.body.movieId);

    // Validate movie exists on the database, if not, return 400 Bad Request.
    if (!movie) {
        return res.status(400).send(`Movie not found (id: ${req.body.movieId.trim()}) on the database.`);
    }

    // Check if movie available to be rental, by the number in stock, if not, return 400 Bad Request.
    if (movie.numberInStock === 0) {
        return res.status(400).send(`Movie ${ movie.title } is out of stock.`);
    }

    // Get the customer of the rental by the id.
    const customer = await Customer.findById(req.body.customerId);

    // Validate customer exists on the database, if not, return 400 Bad Request.
    if (!customer) {
        return res.status(400).send(`Customer not found (id: ${req.body.customerId.trim()}) on the database.`);
    }

    let rental;
    try {
        rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            },
        });
    } catch (err) {
        console.error('Failed to create the rental.', err);
    }

    // Try to save the new rental and decrement the number in stock movies using two phase commit technique.
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {
                _id: movie._id
            }, {
                $inc: {
                    numberInStock: -1
                }
            })
            .run();

        // Return new rental.
        return res.send(rental);
    } catch (err) {
        console.error('Failed to create the rental.', err);
        res.status(500).send('Failed to create the rental.');
    }
});

// Validate that the request body is not empty and the request body parameters.
const validateRequestRental = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function.
    return validateRental({
        customerId: req.body.customerId,
        movieId: req.body.movieId
    });
};

module.exports = router;