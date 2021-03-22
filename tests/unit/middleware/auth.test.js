const {
    User,
} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

// Unit tests for auth middleware.
describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid user token.', () => {
        // Create the user structure with mongoose Id.
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        };

        // Create the user token with the user instance.
        const userToken = new User(user).generateAuthToken();

        // Set the token on the header as well as other parameters.
        const req = {
            headers: []
        };
        req.headers['x-auth-token'] = userToken;
        const res = {};
        const next = jest.fn();

        // Call the auth middleware.
        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});