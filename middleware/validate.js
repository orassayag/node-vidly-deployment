// Create dynamic validator middleware - validate the request in each route.
module.exports = (validator) => {
    return (req, res, next) => {
        //If invalid rental parameters, return 400 Bad Request.
        const validateRentalResult = validator(req);
        if (!validateRentalResult.isValid) {
            return res.status(400).send(validateRentalResult.errorMessage);
        }

        if (next) {
            next();
        }
    };
};