const request = require('supertest');
const moment = require('moment');
const mongoose = require('mongoose');
const { Customer } = require('../../models/customer');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');

let server;

// Integration tests for genres.
describe('/api/genres', () => {
    // Create the server before each test.
    beforeEach(() => {
        server = require('../../index');
    });

    // Close the server after each test.
    afterEach(async () => {
        if (server) {
            await server.close();
        }

        // Remove fake genres.
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres.', async () => {
            // Insert fake genres.
            await Genre.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            // Get response from the API.
            const res = await request(server).get('/api/genres');

            // Check status code.
            expect(res.status).toBe(200);

            // Check array length.
            expect(res.body.length).toBe(2);

            // Check for the specific inserted documents.
            expect(res.body.some((g) => {
                return g.name === 'genre1';
            })).toBeTruthy();
            expect(res.body.some((g) => {
                return g.name === 'genre2';
            })).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a specific genre by a given Id.', async () => {
            // Insert fake genre.
            const genre = await new Genre({
                name: 'genre1'
            }).save();

            // Get response from the API.
            const res = await request(server).get('/api/genres/' + genre._id);

            // Check status code.
            expect(res.status).toBe(200);

            // Check match objects.
            expect(res.body).toMatchObject({ _id: genre._id.toString(), name: 'genre1' });

            // Check specific property for extra security.
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 genre by a given Id that does not exist in the database.', async () => {
            // Insert fake genre.
            const genre = await new Genre({
                name: 'genre1'
            }).save();

            // Remove the genre from the database so that we can generate 404.
            await Genre.findByIdAndRemove(genre._id);

            // Get response from the API.
            const res = await request(server).get('/api/genres/' + genre._id);

            // Check status code.
            expect(res.status).toBe(404);
        });

        it('should return 400 genre by a given Id that is not valid.', async () => {
            // Get response from the API.
            const res = await request(server).get('/api/genres/2');

            // Check status code.
            expect(res.status).toBe(400);
        });
    });

    describe('POST /', () => {
        // Define the happy path, and then in each test we change
        // one parameter that clearly aligns with the name of the
        // test.
        let token;
        let name;
        const execute = async () => {
            // Call the API to create a new genre.
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: name });
        };

        // Generate user token and parameter name before each test.
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if the client is not logged in', async () => {
            // Set the token to be empty.
            token = '';

            // Call the API to create a new genre.
            const res = await execute();

            // Check status code.
            expect(res.status).toBe(401);
        });

        it('should return 400 if the client has not provided parameter name.', async () => {
            // Set the name to be empty.
            name = '';

            // Call the API to create a new genre.
            const res = await execute();

            // Check status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if the client has not provided a name parameter that is less than 5 characters length', async () => {
            // Set the genre name to be less than 5 characters length.
            name = 'genr';

            // Call the API to create a new genre.
            const res = await execute();

            // Check status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if the client has not provided a name parameter that is more than 50 characters length', async () => {
            // Set the genre name to be more than 50 characters length.
            name = new Array(52).join('a');

            // Call the API to create a new genre.
            const res = await execute();

            // Check status code.
            expect(res.status).toBe(400);
        });

        it('should save the genre on the database.', async () => {
            // Call the API to create a new genre.
            const res = await execute();

            // Get the genre from the database.
            const genre = await Genre.findOne({ name: name });

            // Check status code.
            expect(res.status).toBe(200);

            // Check that genre exists.
            expect(genre).not.toBeNull();
        });

        it('should return 200 with the new genre.', async () => {
            // Call the API to create a new genre.
            const res = await execute();

            // Check status code.
            expect(res.status).toBe(200);

            // Check for Id and name properties.
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});

// Integration tests for auth middleware.
describe('auth middleware', () => {
    // Create the server before each test.
    beforeEach(() => {
        server = require('../../index');
    });

    // Close the server after each test.
    afterEach(async () => {
        if (server) {
            await server.close();
        }

        // Remove fake genres.
        await Genre.remove({});
    });

    let token;
    let tokenKey;
    const execute = () => {
        return request(server)
            .post('/api/genres')
            .set(tokenKey, token)
            .send({ name: 'genre1' });
    };

    // Generate user token before each test.
    beforeEach(() => {
        token = new User().generateAuthToken();
        tokenKey = 'x-auth-token';
    });

    it('should return 401 if no token was provided.', async () => {
        // Set the token to be empty.
        token = '';

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(401);
    });

    it('should return 401 if an empty space token was provided.', async () => {
        // Set the token to be empty space.
        token = ' ';

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(401);
    });

    it('should return 401 if an invalid (undefined) token was provided.', async () => {
        // Set the token key to invalid.
        tokenKey = 'x-au';

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(401);
    });

    it('should return 400 if an invalid (null) token was provided.', async () => {
        // Set the token to be null.
        token = null;

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(400);
    });

    it('should return 400 if an invalid token was provided.', async () => {
        // Set the token to be invalid.
        token = 'a';

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(400);
    });

    it('should return 200 and user payload if a valid token was provided.', async () => {
        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(200);
    });
});

// Integration tests for returns in rentals.
describe('/api/returns', () => {
    let token;
    let customerId;
    let movieId;
    let customerIdKey
    let movieIdKey;

    // Create the server before each test.
    beforeEach(async () => {
        server = require('../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        customerIdKey = 'customerId';
        movieIdKey = 'movieId';
        tokenKey = 'x-auth-token';
    });

    // Close the server after each test.
    afterEach(async () => {
        if (server) {
            await server.close();
        }

        // Remove test data.
        await Movie.remove({});
        await Genre.remove({});
        await Customer.remove({});
        await Rental.remove({});
    });

    const execute = async () => {
        const send = {};
        send[customerIdKey] = customerId;
        send[movieIdKey] = movieId;

        return await request(server)
            .post('/api/returns')
            .set(tokenKey, token)
            .send(send);
    };

    const createCustomer = async () => {
        return await new Customer({
            _id: customerId,
            name: 'Test customer',
            phone: '1234567'
        }).save();
    };

    const createMovie = async () => {
        const genre = await new Genre({
            name: 'Test genre'
        }).save();

        return await new Movie({
            _id: movieId,
            title: 'movie title',
            genre: new Genre({
                _id: genre._id,
                name: genre.name
            }),
            numberInStock: 2,
            dailyRentalRate: 2
        }).save();
    };

    const createRental = async () => {
        // Create test rental.
        return await new Rental({
            customer: {
                _id: customerId,
                name: '123456',
                phone: '123456'
            },
            movie: {
                _id: movieId,
                title: '123456',
                dailyRentalRate: 2
            }
        }).save();
    };

    describe('token tests', () => {
        it('should return 401 if no token was provided.', async () => {
            // Set the token to be empty.
            token = '';

            // Call the API.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(401);
        });

        it('should return 401 if an empty space token was provided.', async () => {
            // Set the token to be empty space.
            token = ' ';

            // Call the API.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(401);
        });

        it('should return 401 if an invalid (undefined) token was provided.', async () => {
            // Set the token key to invalid.
            tokenKey = 'x-au';

            // Call the API.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(401);
        });

        it('should return 400 if an invalid (null) token was provided.', async () => {
            // Set the token to be null.
            token = null;

            // Call the API.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if an invalid token was provided.', async () => {
            // Set the token to be invalid.
            token = 'a';

            // Call the API.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });
    });

    describe('customerId parameter tests', () => {
        it('should return 400 if a customerId was not provided (empty string).', async () => {
            customerId = '';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a customerId was not provided (empty spaces string).', async () => {
            customerId = ' ';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a customerId was not provided (null).', async () => {
            customerId = null;

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a customerId was not provided (undefined).', async () => {
            customerIdKey = '';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a customerId was invalid.', async () => {
            customerId = 'a';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });
    });

    describe('movieId parameter tests', () => {
        it('should return 400 if a movieId was not provided (empty string).', async () => {
            movieId = '';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a movieId was not provided (empty spaces string).', async () => {
            movieId = ' ';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a movieId was not provided (null).', async () => {
            movieId = null;

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a movieId was not provided (undefined).', async () => {
            movieIdKey = '';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });

        it('should return 400 if a movieId was invalid', async () => {
            movieId = 'a';

            // Call the API to get the rental by a customer Id and a movie Id.
            const res = await execute();

            // Check the status code.
            expect(res.status).toBe(400);
        });
    });

    it('should return 404 if a customer with the Id not found in the database.', async () => {
        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(404);
    });

    it('should return 404 if a movie with the Id not found in the database.', async () => {
        // Create the customer.
        await createCustomer();

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(404);
    });

    it('should return 404 if no rental found with customer Id and movie Id.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        await createMovie();

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(404);
    });

    it('should return 500 if a rental is already processed.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        await createMovie();

        // Create a rental and set the dateReturned property.
        const rental = await createRental();
        await Rental.findByIdAndUpdate(rental._id, {
            dateReturned: Date.now()
        });

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(500);
    });

    it('should return 200 if the request is valid.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        await createMovie();

        // Create rental.
        let rental = await createRental();

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(200);


    });

    it('should return 200 if the request is valid.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        await createMovie();

        // Create rental.
        let rental = await createRental();

        // Call the API.
        const res = await execute();

        // Check the status code.
        expect(res.status).toBe(200);
    });

    it('should set the dateReturned property if the request is valid.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        await createMovie();

        // Create a rental.
        let rental = await createRental();

        // Call the API.
        await execute();

        // Check that the rental instance has value in dateReturned property and the diff in seconds is not greater than 10 seconds.
        rental = await Rental.findById(rental._id);
        expect(rental.dateReturned).toBeDefined();
        const diff = new Date() - rental.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rentalFee (rental number of days * movie dailyRentalRate) if the request is valid.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        const movie = await createMovie();

        // Create a rental and update it with 7 days ago in dateOut property.
        let rental = await createRental();
        rental.dateOut = moment().add(-7, 'days').toDate();
        rental.save();

        // Call the API.
        await execute();

        // Check that the rental fee is calculated right.
        rental = await Rental.findById(rental._id);
        const timeDiff = Math.abs(rental.dateOut - rental.dateReturned);
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const rentalFee = diffDays * movie.dailyRentalRate;
        expect(rentalFee).toEqual(rental.rentalFee);
    });

    it('should increase the number in stock of the movie if the request is valid.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        let movie = await createMovie();
        const oldNumberInStock = movie.numberInStock;

        // Create a rental.
        await createRental();

        // Call the API.
        await execute();

        // Check that the numberInStock of the movie is correct.
        movie = await Movie.findById(movie._id);
        expect(movie.numberInStock).toEqual(oldNumberInStock + 1);
    });

    it('should return the rental if the request is valid.', async () => {
        // Create the customer and the movie.
        await createCustomer();
        await createMovie();

        // Create a rental.
        await createRental();

        // Call the API.
        const res = await execute();

        // Get the rental from the database.
        const rental = await Rental.findOne({
            'customer._id': customerId,
            'movie._id': movieId
        });

        // Check that the rental objects properties exist.
        expect(Object.keys(res.body))
            .toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']));

        // Check that the rental objects properties are equals.
        expect(res.body).toHaveProperty('_id', rental._id.toString());
        expect(res.body).toHaveProperty('movie._id', movieId.toString());
        expect(res.body).toHaveProperty('customer._id', customerId.toString());
        expect(res.body).toHaveProperty('rentalFee', rental.rentalFee);
    });
});