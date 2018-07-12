const mongoose = require('mongoose');
const {
    ValidateResult
} = require('../helpers/validations');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

// Create the schema
const Genre = mongoose.model('Genre', genreSchema);

// Validate the genre id
const validateGenreId = (id) => {
    if (!id) {
        return new ValidateResult(false, 'No id sent.');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return new ValidateResult(false, `Invalid genre id ${ id }.`);
    }
    return new ValidateResult(true, null);
}

// Validate the genre parameters
const validateGenre = (genre) => {
    // Validate name
    if (!genre.name) {
        return new ValidateResult(false, 'Parameter name is required.');
    }

    if (genre.name.length < 5 || genre.name.length > 50) {
        return new ValidateResult(false, 'Invalid parameter name (Must be at least 6 and maximum 50 characters length).');
    }
    return new ValidateResult(true, null);
};

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateGenreId = validateGenreId;
module.exports.validateGenre = validateGenre;