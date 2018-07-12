/* // Handle errors globaly
module.exports = (handler) => {
    // Check if the handler exists. If one of them missing - return 500 internal server.
    if (!handler) {
        console.error('No handler function provided.');
        return;
    }

    // Return the new middleware function as a refrence
    return async (req, res, next) => {
        // Execute the function.
        try {
            await handler(req, res);
        } catch (ex) {
            // If error occured, move to the error middleware to handle the error.
            next(ex);
        }
    };
}; */