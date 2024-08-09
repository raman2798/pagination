const fs = require('fs');
const { resolve, basename } = require('path');
const { camelCase, endsWith, reduce, startsWith } = require('lodash');

const controllersFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidControllerFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize controllers
const initializeControllers = () => {
  // Read all files in the controllers directory
  const files = fs.readdirSync(controllersFolder);

  // Construct controllers object
  return reduce(
    files,
    (controllers, file) => {
      if (isValidControllerFile(file)) {
        // Generate controller name from filename
        const controllerName = `${camelCase(basename(file, '.js'))}Controller`;

        // Resolve full path to the controller file
        const filePath = resolve(controllersFolder, file);

        // Assign controller to the object
        controllers[controllerName] = require(filePath);
      }

      return controllers;
    },
    {}, // Initial value of the controllers object
  );
};

module.exports = initializeControllers();
