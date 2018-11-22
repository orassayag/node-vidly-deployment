const mongoose = require('mongoose');
const { ValidateResult } = require('../helpers/validations');

// Create the schema.
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

// Define new function to get rental using customerId and movieId parameters.
rentalSchema.statics.lookup = function(customerId, movieId) {
    // Get the rental from database.
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

// Calculate the rental fee and setup the dateReturned property.
rentalSchema.methods.return = function(dailyRentalRate) {
    const timeDiff = Math.abs(this.dateOut - new Date());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.dateReturned = new Date();
    this.rentalFee = diffDays * dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

// Validate the rental parameters.
const validateRental = (rental) => {
    // Validate customerId.
    if (!rental.customerId || rental.customerId.trim().length <= 0) {
        return new ValidateResult(false, 'Parameter customerId is required.');
    }

    if (!mongoose.Types.ObjectId.isValid(rental.customerId)) {
        return new ValidateResult(false, `Invalid customer id ${ rental.customerId }.`);
    }

    // Validate movieId.
    if (!rental.movieId || rental.movieId.trim().length <= 0) {
        return new ValidateResult(false, 'Parameter movieId is required.');
    }

    if (!mongoose.Types.ObjectId.isValid(rental.movieId)) {
        return new ValidateResult(false, `Invalid movie id ${ rental.movieId }.`);
    }

    return new ValidateResult(true, null);
};

module.exports = {
    Rental: Rental,
    validateRental: validateRental
};