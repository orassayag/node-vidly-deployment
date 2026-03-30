# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/node-vidly-deployment/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment details (OS, Node version, MongoDB version)
   - Sample request/response (if applicable)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:
- **JavaScript ES6** syntax
- **ESLint** for code quality
- **Jest** for testing

Before submitting:
```bash
# Run tests
npm test

# Check for linting errors
npm run lint
```

### Coding Standards

1. **Validation**: Always validate user input before processing
2. **Error handling**: Use try-catch blocks and return appropriate HTTP status codes
3. **Security**: Never expose sensitive data in error messages or logs
4. **Authentication**: Protect routes that modify data with authentication middleware
5. **Database**: Use Mongoose models and schemas for all database operations
6. **RESTful design**: Follow REST conventions for endpoints
7. **Transactions**: Use Fawn for operations requiring multiple database updates

### Testing

When adding new features:
1. Write both unit and integration tests
2. Place unit tests in `tests/unit/`
3. Place integration tests in `tests/integration/`
4. Use descriptive test names
5. Mock external dependencies appropriately
6. Ensure all tests pass before submitting PR

### API Endpoints

When adding or modifying endpoints:
1. Follow RESTful naming conventions
2. Return appropriate HTTP status codes
3. Include proper validation
4. Add authentication where needed
5. Document the endpoint behavior

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
