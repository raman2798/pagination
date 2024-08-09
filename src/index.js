const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { NOT_FOUND } = require('http-status');
const swaggerUi = require('swagger-ui-express');
const { appConfiguration, loggerConfiguration } = require('./config');
const { globalErrorHandlerMiddleware } = require('./middlewares');
const { sequelize } = require('./models');
const { initializeRoutes } = require('./routes');
const { swaggerSpecs } = require('./docs/swagger');

const { serverPort } = appConfiguration;

// Configure error handling middleware
const configureErrorHandling = (app) => {
  // Handle unknown API requests
  app.use((req, res, next) => {
    next({ statusCode: NOT_FOUND, message: 'Invalid endpoint' });
  });

  // Global error handler
  app.use(globalErrorHandlerMiddleware);
};

// Configure middleware stack for the Express app
const configureMiddlewares = (app) => {
  // Parse JSON request bodies with increased limits
  app.use(express.json({ limit: '10mb' }));

  // Parse urlencoded request bodies with increased limits
  app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

  // Enable CORS with broad access (modify origin based on your needs)
  app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

  // Set secure headers with Helmet
  app.use(helmet());

  // Disable x-powered-by header to hide server-side technology
  app.disable('x-powered-by');
};

// Configure application routes
const configureRoutes = (app) => {
  // Initialize API routes
  initializeRoutes(app);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Health check endpoint
  app.use('/health-check', (req, res) => {
    res.json({ message: 'Application running successfully!' });
  });
};

// Function to start the Express server
const startServer = async () => {
  try {
    // Create an instance of Express application
    const app = express();

    // Configure middlewares for the Express app
    configureMiddlewares(app);

    // Configure routes for the Express app
    configureRoutes(app);

    // Configure error handling for the Express app
    configureErrorHandling(app);

    // Check database connection
    await sequelize.authenticate();

    loggerConfiguration.info('Database connected');

    // Start the Express server
    const server = app.listen(serverPort, () => {
      loggerConfiguration.info(`Server started on port ${serverPort}`);
    });

    // Function to handle graceful shutdown
    const exitHandler = () => {
      server.close(() => {
        loggerConfiguration.info('Server closed');

        process.exit(0);
      });
    };

    // Function to handle unexpected errors
    const unexpectedErrorHandler = (error) => {
      loggerConfiguration.error(`Unexpected error: ${error}`);

      exitHandler();
    };

    // Handle uncaught exceptions
    process.on('uncaughtException', unexpectedErrorHandler);

    // Handle unhandled rejections
    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error) {
    // Log error if failed to start server and exit process
    loggerConfiguration.error(`Failed to start server: ${error}`);

    process.exit(1);
  }
};

// Start the Express server
startServer();
