// Check if the user is admin or not for some actions.
module.exports = (req, res, next) => {
    // Check if all parameters exist, if not - return 400 - Bad Request.
    if (!req || !req.user) {
        return res.status(400).send('Invalid request.');
    }

    // Check if isAdmin is type boolean, if not - return 400 - Bad request.
    if (typeof (req.user.isAdmin) !== 'boolean') {
        return res.status(400).send('Invalid request.');
    }

    // Check if the user is admin, if not - return 403 - Forbidden.
    if (!req.user.isAdmin) {
        return res.status(403).send('Access denied.');
    }

    // If admin, continue to the next function (Route handler).
    if (next) {
        next();
    }
};