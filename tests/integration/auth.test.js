const request = require('supertest');
const { User } = require('../../models/user');

let server;
// Integration tests for auth middleware.
describe('auth middleware', () => {
    // Define the happy path, and then in each test we change
    // one parameter that clearly aligns with the name of the
    // test.
    let token;
    const execute = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    // Generate user token before each test.
    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token was provided', async () => {
        // Set the token to be empty.
        token = '';

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(401);
        expect(1).toBe(1);
    });
});