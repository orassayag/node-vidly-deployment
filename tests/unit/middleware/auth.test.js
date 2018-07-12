const {
    User,
} = require('../../../models/user');
const auth = require('../../../middleware/auth');
const moongose = require('mongoose');

// Unit tests for auth middlewere.
describe('auth middlewere', () => {
    it('should populate req.user with the payload of a valid user token', () => {
        // Create user structure with mongoose id.
        const user = { 
            _id: new moongose.Types.ObjectId().toHexString(),
            isAdmin: true,  
        };

        // Create user token with user instance.
        const userToken = new User(user).generateAuthToken();

        // Set the token on the header as well as other parameters.
        const req = {
            headers: []
        };
        req.headers['x-auth-token'] = userToken;
        const res = {};
        const next = jest.fn();

        // Call the auth middlewere.
        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});