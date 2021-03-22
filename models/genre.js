const mongoose = require('mongoose');
const { ValidateResult } = require('../helpers/validations');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

// Create a genre schema.
const Genre = mongoose.model('Genre', genreSchema);

// Validate the genre Id.
const validateGenreId = (id) => {
    if (!id) {
        return new ValidateResult(false, 'No Id sent.');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return new ValidateResult(false, `Invalid genre Id ${id}.`);
    }
    return new ValidateResult(true, null);
}

// Validate the genre parameters.
const validateGenre = (genre) => {
    // Validate name.
    if (!genre.name) {
        return new ValidateResult(false, 'Parameter name is required.');
    }

    if (genre.name.length < 5 || genre.name.length > 50) {
        return new ValidateResult(false, 'Invalid parameter name (Must be at least 6 and maximum 50 characters length).');
    }
    return new ValidateResult(true, null);
};

module.exports = {
    Genre: Genre,
    genreSchema = genreSchema,
    validateGenreId = validateGenreId,
    validateGenre = validateGenre
};