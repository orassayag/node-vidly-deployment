# Setup and Usage Instructions

## Table of Contents

1. [Version](#version)
2. [Last Updated](#last-updated)
3. [System Requirements](#system-requirements)
4. [Prerequisites](#prerequisites)
5. [Initial Setup](#initial-setup)
6. [Install Dependencies](#install-dependencies)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [Running Scripts](#running-scripts)
10. [Development Commands](#development-commands)
11. [Available Commands](#available-commands)
12. [API Endpoints](#api-endpoints)
13. [Authentication](#authentication)
14. [Database Schema](#database-schema)
15. [Error Handling](#error-handling)
16. [Logging](#logging)
17. [Security Features](#security-features)
18. [Production Deployment](#production-deployment)
19. [Troubleshooting](#troubleshooting)
20. [Best Practices](#best-practices)
21. [Extending the Application](#extending-the-application)
22. [Documentation](#documentation)
23. [External Resources](#external-resources)
24. [Support](#support)
25. [Author](#author)

## Version

1.0.0

## Last Updated

June 2026

## System Requirements

- **Node.js**: Version 8.11.3 or higher
- **Package Manager**: npm or yarn
- **Operating System**: macOS, Linux, or Windows
- **Memory**: 1GB RAM minimum
- **Disk Space**: 500MB for application and dependencies

## Prerequisites

- Node.js (v8.11.3 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Initial Setup

1. Open the project in your IDE (VSCode recommended)
2. Clone the repository (if not already done):
   ```bash
   git clone https://github.com/orassayag/node-vidly-deployment.git
   cd node-vidly-deployment
   ```
3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `vidly`

## Install Dependencies

Install the project dependencies:

```bash
npm install
```

## Setup and Usage Instructions

Follow the configuration and running instructions below to set up and use the application.

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

## Running Scripts

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

## Development Commands

### Linting

```bash
npm run lint
```

### Testing

```bash
# Run all tests
npm test
```

## Available Commands

- `npm start` - Start the application server
- `npm test` - Run all tests
- `npm run lint` - Run ESLint for code quality checks

## Troubleshooting

### Common Issues and Solutions

#### MongoDB Connection Errors

**Problem**: "MongoServerError: Authentication failed" or connection timeout

**Solutions:**

1. Verify MongoDB connection string in configuration files
2. Ensure MongoDB server is running
3. Check network connectivity (for Atlas, check IP whitelist)
4. Verify credentials and database name

#### Port Already in Use

**Problem**: "Error: listen EADDRINUSE: address already in use :::3000"

**Solutions:**

1. Change the port in configuration or set PORT environment variable
2. Or stop the process using port 3000:

   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

#### JWT Authentication Errors

**Problem**: "Invalid token" or "Token not provided"

**Solutions:**

1. Ensure x-auth-token header is set correctly
2. Verify token hasn't expired
3. Check JWT secret key configuration
4. Ensure you're using a valid token from /api/auth endpoint

#### Test Failures

**Problem**: Tests are failing unexpectedly

**Solutions:**

1. Ensure test database is configured correctly
2. Check that NODE_ENV is set to test
3. Verify test dependencies are installed
4. Check logs for detailed error messages

### Debugging Tips

#### Enable Verbose Logging

1. Check the console for error messages
2. Review log files (uncaughtExceptions.log, logfile.log)
3. Check MongoDB for error logs

#### Test Configuration

```bash
# Verify Node version
node --version

# Verify npm version
npm --version

# Reinstall dependencies if needed
rm -rf node_modules package-lock.json
npm install
```

## Best Practices

### Development Workflow

1. **Environment Setup**: Always set the appropriate NODE_ENV
2. **Secrets Management**: Never commit secrets files to version control
3. **Testing**: Write tests for new features before implementing them
4. **Code Quality**: Run ESLint before committing changes
5. **Documentation**: Update documentation when adding new features

### Security Best Practices

1. **Password Security**: Always use bcrypt for password hashing
2. **JWT Security**: Use strong secret keys and appropriate expiration times
3. **Input Validation**: Validate and sanitize all user input
4. **Role-Based Access**: Use admin middleware for sensitive operations
5. **Helmet**: Keep Helmet middleware enabled in production
6. **CORS**: Configure CORS appropriately for your use case

### Deployment Best Practices

1. **Environment Configuration**: Use production environment settings
2. **Logging**: Monitor logs for errors and security issues
3. **Performance**: Enable compression and other production optimizations
4. **Database**: Use a secure MongoDB connection (Atlas with IP whitelisting recommended)
5. **Backup**: Regularly backup your database

## Extending the Application

### Adding New Routes

1. Create a new route file in `routes/`
2. Define your route handlers
3. Register the route in `startup/routes.js`

### Adding New Models

1. Create a new model file in `models/`
2. Define your Mongoose schema
3. Export the model

### Adding New Middleware

1. Create a new middleware file in `middleware/`
2. Implement your middleware function
3. Use it in your routes

Example:

```javascript
// middleware/myMiddleware.js
module.exports = function (req, res, next) {
  // Your middleware logic here
  next();
};

// In routes/yourRoute.js
const myMiddleware = require('../middleware/myMiddleware');

router.post('/', myMiddleware, (req, res) => {
  // Route handler
});
```

## Documentation

- [README.md](README.md) - Project overview and features
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Code of conduct
- [SECURITY.md](SECURITY.md) - Security policy

## External Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Jest Documentation](https://jestjs.io/docs/)
- [Winston Documentation](https://github.com/winstonjs/winston)

## Support

For questions, issues, or contributions:

- **GitHub Issues**: [https://github.com/orassayag/node-vidly-deployment/issues](https://github.com/orassayag/node-vidly-deployment/issues)
- **Email**: orassayag@gmail.com

## Author

- **Or Assayag** - _Initial work_ - [orassayag](https://github.com/orassayag)
- Or Assayag <orassayag@gmail.com>
- GitHub: https://github.com/orassayag
- StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
- LinkedIn: https://linkedin.com/in/orassayag
