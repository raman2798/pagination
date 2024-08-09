const fs = require('fs');
const { resolve, basename } = require('path');
const { camelCase, endsWith, reduce, startsWith } = require('lodash');

const middlewaresFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidMiddlewareFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize middlewares
const initializeMiddlewares = () => {
  // Read all files in the middlewares directory
  const files = fs.readdirSync(middlewaresFolder);

  // Construct middlewares object
  return reduce(
    files,
    (middlewares, file) => {
      if (isValidMiddlewareFile(file)) {
        // Generate middleware name from filename
        const middlewareName = `${camelCase(basename(file, '.js'))}Middleware`;

        // Resolve full path to the middleware file
        const filePath = resolve(middlewaresFolder, file);

        // Assign middleware to the object
        middlewares[middlewareName] = require(filePath);
      }

      return middlewares;
    },
    {}, // Initial value of the middlewares object
  );
};

module.exports = initializeMiddlewares();
