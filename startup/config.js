module.exports = (config) => {
    // Check that config working and keys found.
    if (!config.jwtPrivateKey) {
        throw new Error('FATAL ERROR: jwtPrivateKey is undefined.');
    }
};