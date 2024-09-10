# NestJS Food Delivery Project

This project is a food delivery application built with NestJS, utilizing a microservices architecture with GraphQL.

## Project Structure

The project is set up as a monorepo with multiple applications:

- `gateway`: The main entry point of the application, handling API requests and routing them to the appropriate microservices.
- `users`: A microservice handling user-related operations.

## Prerequisites

- Node.js (version specified in package.json)
- npm (comes with Node.js)
- Docker (optional, for containerization)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary environment variables.

## Running the Application

To run the application in development mode:

1. Start the users microservice:

   ```
   npm run start:dev users
   ```

2. In a separate terminal, start the gateway:
   ```
   npm run start:dev gateway
   ```

The application should now be running and accessible.

## Scripts

- `npm run build`: Build the application
- `npm run format`: Format the code using Prettier
- `npm run start`: Start the application
- `npm run start:dev`: Start the application in watch mode
- `npm run start:debug`: Start the application in debug mode
- `npm run start:prod`: Start the application in production mode
- `npm run lint`: Lint the code
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:cov`: Run tests with coverage
- `npm run test:debug`: Debug tests
- `npm run test:e2e`: Run end-to-end tests

## Dependencies

Key dependencies include:

- NestJS framework and related packages
- Apollo Server for GraphQL
- Prisma as the ORM
- Jest for testing
- ESLint and Prettier for code quality

For a full list of dependencies, refer to the `package.json` file.

## Development

This project uses TypeScript. Make sure to follow the established coding style and practices.

## Testing

Tests can be run using the `npm test` command. For more specific test runs, use the scripts mentioned in the Scripts section.

## Contributing

[Add contribution guidelines here]

## License

This project is licensed under the UNLICENSED license.
