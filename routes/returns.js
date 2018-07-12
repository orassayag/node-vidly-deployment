const express = require('express');
const router = express.Router();
/* const Fawn = require('fawn'); */
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validateRental } = require('../models/rental');

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

// Update rental to be returned.
router.post('/', [auth, validate(validateRequestRental)], async (req, res) => {
/*     //If invalid rental parameters, return 400 Bad Request
    const validateRentalResult = validateRequestRental(req);
    if (!validateRentalResult.isValid) {
        return res.status(400).send(validateRentalResult.errorMessage);
    } */

    // Get the customer of the rental by the id
    const customer = await Customer.findById(req.body.customerId);

    // Validate customer exists on the database, if not, return 400 Bad Request
    if (!customer) {
        return res.status(404).send(`Customer not found (id: ${req.body.customerId.trim()}) on the database.`);
    }

    // Get the movie of the rental by the id
    const movie = await Movie.findById(req.body.movieId);

    // Validate movie exists on the database, if not, return 400 Bad Request
    if (!movie) {
        return res.status(404).send(`Movie not found (id: ${req.body.movieId.trim()}) on the database.`);
    }

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId); 

/*     // Get the rental from database.
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    }); */

    // Validate rental exists on the database, if not, return 400 Bad Request
    if (!rental) {
        return res.status(404).send(`Rental not found (customerId: ${req.body.customerId.trim()}, movieId: ${req.body.movieId.trim()}) on the database.`);
    }

    // Validate that the rental not returned already.
    if (rental.dateReturned) {
        return res.status(500).send(`Rental (id: ${rental._id}) already returned.`);
    }

    /*     // Update the rental's dateReturned and rentalFee properties and update the movie's numberInStock property.
        const timeDiff = Math.abs(rental.dateOut - new Date());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const fee = diffDays * movie.dailyRentalRate;

       new Fawn.Task()
            .update('rentals', {
                _id: rental._id
            }, {
                $inc: {
                    rentalFee: 1
                }
            })
            .update('movies', {
                _id: movie._id
            }, {
                $inc: {
                    numberInStock: 1
                }
            })
            .run(); */

/*     // Update the rental's dateReturned and rentalFee properties.
    const timeDiff = Math.abs(rental.dateOut - new Date());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    rental.dateReturned = new Date();
    rental.rentalFee = diffDays * movie.dailyRentalRate;
    rental.save(); */

    // Update the rental's dateReturned and rentalFee properties.
    rental.return(movie.dailyRentalRate);
    rental.save();

    // Update the movie's numberInStock property.
    movie.numberInStock++;
    movie.save();

    return res.send(rental);
});

module.exports = router;