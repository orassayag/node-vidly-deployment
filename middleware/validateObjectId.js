const mongoose = require('mongoose');

// Check if the element Id is exists and valid.
module.exports = (req, res, next) => {
    if (!req || !req.params || !req.params.id) {
        return res.status(400).send('Invalid Id.');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid Id.');
    }

    if (next) {
        next();
    }
};