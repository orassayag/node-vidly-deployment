const { Genre, validateGenreId, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { ValidateResult } = require('../helpers/validations');
const express = require('express');
const router = express.Router();

// Get all genres sorted by name ascending.
router.get('/', async (req, res) => {
    return res.send(await Genre.find().sort('name'));
});

// Create a genre and return it.
router.post('/', auth, async (req, res) => {

    // If invalid genre parameters, return 400 - Bad Request.
    const validateGenreResult = validateRequestGenre(req);
    if (!validateGenreResult.isValid) {
        return res.status(400).send(validateGenreResult.errorMessage);
    }

    // Create a new genre.
    let genre;
    try {
        genre = await new Genre({
            name: req.body.name
        }).save();
    } catch (err) {
        console.error('Failed to create the genre.', err);
    }

    // Validate genre saved on the database, if not, return 400 - Bad Request.
    if (!genre) {
        return res.status(400).send('Failed to save the genre on the database.');
    }

    // Return the new genre.
    return res.send(genre);
});

// Update a genre and return it.
router.put('/:id', [validateObjectId], async (req, res) => {

    // If invalid genre parameters, return 400 - Bad Request.
    const validateGenreResult = validateRequestGenre(req);
    if (!validateGenreResult.isValid) {
        return res.status(400).send(validateGenreResult.errorMessage);
    }

    // Update the existing genre.
    let genre;
    try {
        genre = await Genre.findByIdAndUpdate(req.params.id.trim(), {
            name: req.body.name.trim()
        }, {
            new: true
        });
    } catch (err) {
        console.error(`Failed to update the genre (Id: ${req.params.id.trim()}).`, err);
    }

    // Validate that the genre was saved on the database, if not, return 400 - Bad Request.
    if (!genre) {
        return res.status(400).send(`Failed to update the genre (Id: ${req.params.id.trim()}) on the database.`);
    }

    // Return the updated genre.
    return res.send(genre);
});

// Delete a genre and return it.
router.delete('/:id', [auth, admin], async (req, res) => {

    // If invalid genre Id parameter, return 400 - Bad Request.
    const validateIdResult = validateRequestId(req);
    if (!validateIdResult.isValid) {
        return res.status(400).send(validateIdResult.errorMessage);
    }

    // Delete the genre.
    let genre;
    try {
        genre = await Genre.findByIdAndRemove(req.params.id.trim());
    } catch (err) {
        console.error(`Failed to delete the genre (Id: ${req.params.id.trim()}).`, err);
    }

    // Validate that the genre was deleted from the database, if not, return 400 - Bad Request.
    if (!genre) {
        return res.status(400).send(`Failed to delete the genre (Id: ${req.params.id.trim()}) from the database.`);
    }

    // Return the deleted genre.
    return res.send(genre);
});

// Get a specific genre by Id and return it.
router.get('/:id', [validateObjectId], async (req, res) => {

    // Get the genre by Id.
    let genre;
    try {
        genre = await Genre.findById(req.params.id.trim());
    } catch (err) {
        console.error(`Failed to get the genre (Id: ${req.params.id.trim()}).`, err);
    }

    // Validate the genre from the database, if not exists, return 404 - Not Found.
    if (!genre) {
        return res.status(404).send(`Failed to get the genre (Id: ${req.params.id.trim()}) from the database.`);
    }

    // Return the genre.
    return res.send(genre);
});

// Validate that the request Id is not empty and the request Id parameter.
const validateRequestId = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function.
    return validateGenreId(req.params.id);
};

// Validate that the request body is not empty and the request body parameters.
const validateRequestGenre = (req) => {
    if (!req) {
        return new ValidateResult(false, 'No request object.');
    }

    // Get final validation result from model validator function.
    return validateGenre({
        name: req.body.name
    });
};

module.exports = router;