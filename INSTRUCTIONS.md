# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `vidly`

## Configuration

### Environment Variables

Set the following environment variable:
```bash
export NODE_ENV=development
```

Available environments:
- `development` (default)
- `test`
- `production`

### Configuration Files

Edit the configuration files in `config/`:
- `config.development.json` - Development settings
- `config.test.json` - Test environment settings
- `config.production.json` - Production settings

### Secrets Files

Edit the secrets files in `secrets/`:
- `secrets.development.json` - Development secrets (JWT key, DB connection)
- `secrets.test.json` - Test secrets
- `secrets.production.json` - Production secrets

**Important:** Never commit actual secret values to version control.

## Running the Application

### Start the Server
```bash
npm start
```

The server will start on port 3000 (default) or the port specified in `process.env.PORT`.

### Run Tests
```bash
npm test
```

This runs both unit and integration tests using Jest.

## API Endpoints

### Authentication
- `POST /api/auth` - Login and receive JWT token

### Users
- `POST /api/users` - Register a new user
- `GET /api/users/me` - Get current user info (requires auth)

### Genres
- `GET /api/genres` - Get all genres
- `POST /api/genres` - Create a genre (requires auth)
- `PUT /api/genres/:id` - Update a genre (requires auth)
- `DELETE /api/genres/:id` - Delete a genre (requires auth & admin)
- `GET /api/genres/:id` - Get a specific genre

### Movies
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create a movie (requires auth)
- `PUT /api/movies/:id` - Update a movie (requires auth)
- `DELETE /api/movies/:id` - Delete a movie (requires auth)
- `GET /api/movies/:id` - Get a specific movie

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a customer (requires auth)
- `PUT /api/customers/:id` - Update a customer (requires auth)
- `DELETE /api/customers/:id` - Delete a customer (requires auth)
- `GET /api/customers/:id` - Get a specific customer

### Rentals
- `GET /api/rentals` - Get all rentals
- `POST /api/rentals` - Create a rental (requires auth)

### Returns
- `POST /api/returns` - Process a movie return (requires auth)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token
1. Register a user via `POST /api/users`
2. Login via `POST /api/auth` with email and password
3. Use the returned token in the `x-auth-token` header for protected routes

### Using a Token
Include the token in request headers:
```
x-auth-token: your-jwt-token-here
```

## Database Schema

### User
- `name`: String (5-100 chars)
- `email`: String (unique, 5-255 chars)
- `password`: String (hashed, 5-1024 chars)
- `isAdmin`: Boolean

### Genre
- `name`: String (5-50 chars)

### Movie
- `title`: String (5-255 chars)
- `genre`: Object (embedded genre)
- `numberInStock`: Number (0-255)
- `dailyRentalRate`: Number (0-255)

### Customer
- `name`: String (5-50 chars)
- `phone`: String (5-50 chars)
- `isGold`: Boolean

### Rental
- `customer`: Object (embedded customer info)
- `movie`: Object (embedded movie info)
- `rentalDate`: Date
- `returnDate`: Date
- `rentalFee`: Number

## Error Handling

The application includes centralized error handling:
- Uncaught exceptions are logged to `uncaughtExceptions.log`
- Unhandled promise rejections are logged to `logfile.log`
- MongoDB errors are logged to the database
- All errors return appropriate HTTP status codes

## Logging

Logs are written to:
- Console (in development)
- `logfile.log` - General application logs
- `uncaughtExceptions.log` - Uncaught exceptions
- MongoDB - Errors collection

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Helmet for HTTP header security
- Input validation on all endpoints
- Protected routes with auth middleware
- Admin-only routes with admin middleware
- MongoDB ObjectId validation

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Configure production secrets in `secrets.production.json`
3. Set appropriate MongoDB connection string
4. Use compression middleware (automatically enabled)
5. Use Helmet for security headers (automatically enabled)
6. Set strong JWT secret key
7. Consider using PM2 or similar for process management

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
