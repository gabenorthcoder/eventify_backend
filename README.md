# Events Platform Backend

## Overview

The Events Platform Backend is a Node.js application built with TypeScript and Express. It serves as the backend for an events management system, allowing users to create, manage, and sign up for events. The backend integrates with a PostgreSQL database using TypeORM and provides a RESTful API for the frontend application.

Production: https://eventify-backend-c7ua.onrender.com/

## Features

- User authentication and authorization
- Event creation, updating, and deletion
- User registration and management
- Integration with Google Calendar API for event scheduling
- Swagger UI for API documentation
- Unit and integration testing with Jest

## Tech Stack

- **Node.js**: JavaScript runtime for building server-side applications
- **TypeScript**: Superset of JavaScript that adds static types
- **Express**: Web framework for Node.js
- **TypeORM**: ORM for TypeScript and JavaScript
- **PostgreSQL**: Relational database management system
- **Jest**: Testing framework for JavaScript
- **Swagger**: API documentation tool

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- TypeScript (v4 or higher)

### Steps

1. **Clone the repository**:
   ```bash
   git clone 
   cd 
   ```

2. **Create a PostgreSQL database**:
   Before running the application, you need to create a PostgreSQL database. You can do this by connecting to your PostgreSQL server and running the following command:
   ```sql
   CREATE DATABASE events_db;
   ```

3. **Set up Google Credentials**:
   To integrate with Google Calendar, you need to set up Google API credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to "APIs & Services" > "Credentials".
   - Click on "Create Credentials" and select "OAuth 2.0 Client IDs".
   - Configure the consent screen and set the application type to "Web application".
   - Add your redirect URI (e.g., `http://localhost:3000/auth/google/calender/callback`).
   - Save your credentials and note down the `Client ID` and `Client Secret`.

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables. You can use the `.env.example` file as a reference:

   ```env
   NODE_ENV = 'development' or 'production' 
   CORS_ORIGIN=http://localhost:3000
   FRONTEND_URL=http://localhost:3000 or prod URL
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_dd_name
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/calender/callback
   GOOGLE_CALENDER_CLIENT_ID=your_google_calendar_client_id
   GOOGLE_CALENDER_CLIENT_SECRET=your_google_calendar_client_secret
   GOOGLE_CALENDER_REDIRECT_URI=http://localhost:3000/auth/google/calender/callback
   SUPER_ADMIN_EMAIL=your_super_admin_email
   SUPER_ADMIN_PASSWORD=your_super_admin_password
   ```

5. **Run database migrations**:
   ```bash
   npm run typeorm migration:run
   ```

6. **Start the server**:
   ```bash
   npm run dev
   ```

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the documentation at:

https://eventify-backend-c7ua.onrender.com/api-docs/

## Testing

To run the tests, use the following command:
```bash
npm test
```

### Running Tests in Watch Mode
```bash
npm run test:watch
```

## Directory Structure

```
src/
├── adapter/
│   ├── controllers/          # Controllers for handling requests
│   ├── middleware/           # Middleware for authentication and authorization
│   └── routes/               # API routes
├── application/              # Application logic and use cases
├── infrastructure/           # Database and external service integrations
├── utils/                   # Utility functions
├── app.ts                    # Main application file
├── server.ts                 # Server entry point
└── infrastructure/repository/ # Database repositories
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Scripts

The following scripts are available for managing the application:

- **`npm run build`**: Compiles the TypeScript code into JavaScript.
- **`npm run start`**: Starts the application in production mode.
- **`npm run dev`**: Starts the application in development mode with hot reloading.
- **`npm run typeorm`**: Runs TypeORM CLI commands.
- **`npm run migration:generate`**: Generates a new migration file.
- **`npm run migration:run`**: Runs the pending migrations.
- **`npm run migration:revert`**: Reverts the last executed migration.
- **`npm run migration:show`**: Shows the current migrations.
- **`npm test`**: Runs the test suite.
- **`npm run test:watch`**: Runs tests in watch mode.
- **`npm run test:coverage`**: Runs tests and generates a coverage report.
- **`npm run test:unit`**: Runs unit tests.

## Environment Variables

The application requires several environment variables to be set. You can use the `.env.example` file as a reference to create your own `.env` file. Here are the required variables: