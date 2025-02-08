# NestJS Food Delivery Project

This project is a food delivery application built with NestJS, utilizing a microservices architecture with GraphQL.

## Project Structure

The project is set up as a monorepo with multiple applications:

- `gateway`: The main entry point of the application, handling API requests and routing them to the appropriate microservices.
- `users`: A microservice handling user-related operations.

## Prerequisites

- Node.js (version specified in package.json)
- Docker (optional, for containerization)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Ejay02/food_delivery.git
 
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables.

## Running the Application

To run the application in development mode:

1. Start the users' microservice:

   ```
   npm run start:dev users
   ```

2. In a separate terminal, start the gateway:
   ```
   npm run start:dev gateway
   ```

The application should now be running and accessible.

### To Access Prisma 
- cd into microservice[user or gateway] and run
  
```
npx prisma studio
```

- to resync db 

```
npx prisma db push
```

## Dependencies

Key dependencies include:

- NestJS framework and related packages
- Apollo Server for GraphQL
- Prisma as the ORM
- ESLint and Prettier for code quality

Refer to the `package.json` file for a full list of dependencies.

## Development

This project uses TypeScript. Make sure to follow the established coding style and practices.


## Contributing

We welcome contributions to the NestJS Food Delivery Project! Here are some guidelines to help you get started:

1. **Fork the Repository**: Start by forking the repository to your own GitHub account.

2. **Clone the Repository**: Clone your forked repository to your local machine.

3. **Create a Branch**: Create a new branch for your feature or bug fix.
   ```
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**: Make your changes in the new branch. Be sure to follow the existing coding style and conventions.

5. **Write Tests**: If adding new functionality, please include relevant tests.

6. **Run Tests**: Ensure all tests pass by running:
   ```
   npm test
   ```

7. **Lint Your Code**: Make sure your code passes the linter:
   ```
   npm run lint
   ```

8. **Commit Changes**: Commit your changes with a clear and descriptive commit message.
   ```
   git commit -m "Add a concise description of your changes"
   ```

9. **Push Changes**: Push your changes to your forked repository.
   ```
   git push origin feature/your-feature-name
   ```

10. **Create a Pull Request**: Go to the original repository on GitHub and create a new pull request from your feature branch.

11. **Code Review**: Wait for the maintainers to review your pull request. Be open to feedback and be prepared to make additional changes if requested.

12. **Merge**: Once approved, your pull request will be merged into the main branch.

### Code Style

- Follow the existing code style in the project.
- Use meaningful variable and function names.
- Comment your code where necessary, especially for complex logic.

### Reporting Issues

If you find a bug or have a suggestion for improvement:

1. Check if the issue already exists in the GitHub issue tracker.
2. If not, create a new issue, providing as much relevant information as possible.

### Questions

If you have any questions about contributing, feel free to ask in the GitHub issues section.

Thank you for contributing to the NestJS Food Delivery Project! ✨

