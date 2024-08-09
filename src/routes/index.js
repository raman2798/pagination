const fs = require('fs');
const { resolve, basename } = require('path');
const { kebabCase, endsWith, startsWith } = require('lodash');

const routesFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidRouteFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize routes
const initializeRoutes = (expressApp) => {
  // Read all files in the routes directory
  const files = fs.readdirSync(routesFolder);

  for (const file of files) {
    if (isValidRouteFile(file)) {
      const fileName = basename(file, '.js');

      // Resolve full path to the rotue file
      const fullPath = resolve(routesFolder, file);

      const routePath = `/api/${kebabCase(fileName)}`;

      const middleware = [];

      // Require the router from file
      const router = require(fullPath);

      // Setup route with middleware
      expressApp.use(routePath, ...middleware, router);
    }
  }
};

module.exports = { initializeRoutes };
