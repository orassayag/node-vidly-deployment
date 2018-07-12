const {
    Movie,
    validateMovieId,
    validateMovie
} = require('../models/movie');
const {
    Genre
} = require('../models/genre');
const {
    ValidateResult
} = require('../helpers/validations');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
    try {
        res.send(await Movie.find().sort('title'));
    } catch (err) {
        console.error('Failed to get all movies', err);
    }
});

// Create movie and return it
router.post('/', auth, async (req, res) => {

    //If invalid movie parameters, return 400 Bad Request
    const validateMovieResult = validateRequestMovie(req);
    if (!validateMovieResult.isValid) {
        return res.status(400).send(validateMovieResult.errorMessage);
    }

    // Get the genre of the movie by the id
    const genre = await Genre.findById(req.body.genreId);

    // Validate genre exists on the database, if not, return 400 Bad Request
    if (!genre) {
        return res.status(400).send(`Genre not found (id: ${req.body.genreId.trim()}) on the database.`);
    }

    // Create new movie
    let movie;
    try {
        movie = await new Movie({
            title: req.body.title,
            genre: new Genre({
                _id: genre._id,
                name: genre.name
            }),
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }).save();
    } catch (err) {
        console.error('Failed to create the movie', err);
    }

    // Validate movie saved on the database, if not, return 400 Bad Request
    if (!movie) {
        return res.status(400).send('Failed to save the movie on the database.');
    }

    // Return new movie
    return res.send(movie);
});

// Update movie and return it
router.put('/:id', async (req, res) => {

    //If invalid movie id parameter, return 400 Bad Request
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    //If invalid movie parameters, return 400 Bad Request
    const validateMovieResult = validateRequestMovie(req);
    if (!validateMovieResult.isValid) {
        return res.status(400).send(validateMovieResult.errorMessage);
    }

    // Get the genre of the movie by the id
    const genre = await Genre.findById(req.body.genreId);

    // Validate genre exists on the database, if not, return 400 Bad Request
    if (!genre) {
        return res.status(400).send(`Genre not found (id: ${req.body.genreId.trim()}) on the database.`);
    }

    // Update existing movie
    let movie;
    try {
        movie = await Movie.findByIdAndUpdate(req.params.id.trim(), {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, {
            new: true
        });
    } catch (err) {
        console.error(`Failed to update the movie (id: ${req.params.id.trim()})`, err);
    }

    // Validate movie saved on the database, if not, return 400 Bad Request
    if (!movie) {
        return res.status(400).send(`Failed to update the movie (id: ${req.params.id.trim()}) on the database.`);
    }

    // Return updated movie
    return res.send(movie);
});

// Delete movie and return it
router.delete('/:id', async (req, res) => {

    //If invalid movie id parameter, return 400 Bad Request
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    // Delete movie
    let movie;
    try {
        movie = await Movie.findByIdAndRemove(req.params.id.trim());
    } catch (err) {
        console.error(`Failed to delete the movie (id: ${req.params.id.trim()})`, err);
    }

    // Validate movie deleted from the database, if not, return 400 Bad Request
    if (!movie) {
        return res.status(400).send(`Failed to delete the movie (id: ${req.params.id.trim()}) from the database.`);
    }

    // Return deleted movie
    return res.send(movie);
});

// Get specific movie by id and return it
router.get('/:id', async (req, res) => {

    //If invalid movie id parameter, return 400 Bad Request
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    // Get the movie by id
    let movie;
    try {
        movie = await Movie.findById(req.params.id.trim());
    } catch (err) {
        console.error(`Failed to get the movie (id: ${req.params.id.trim()})`, err);
    }

    // Validate movie from the database, if not exists, return 404 Not Found
    if (!movie) {
        return res.status(404).send(`Failed to get the movie (id: ${req.params.id.trim()}) from the database.`);
    }

    // Return movie
    return res.send(movie);
});

// Validate that the request id is not empty and the request id parameter
const validateRequestId = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function
    return validateMovieId(req.params.id);
};

// Validate that the request body is not empty and the request body parameters
const validateRequestMovie = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function
    return validateMovie({
        title: req.body.title,
        genreId: req.body.genreId,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
};

module.exports = router;