const fs = require('fs');
const { resolve, basename } = require('path');
const { camelCase, endsWith, reduce, startsWith } = require('lodash');

const servicesFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidServiceFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize services
const initializeServices = () => {
  // Read all files in the services directory
  const files = fs.readdirSync(servicesFolder);

  // Construct services object
  return reduce(
    files,
    (services, file) => {
      if (isValidServiceFile(file)) {
        // Generate service name from filename
        const serviceName = `${camelCase(basename(file, '.js'))}Service`;

        // Resolve full path to the service file
        const filePath = resolve(servicesFolder, file);

        // Assign service to the object
        services[serviceName] = require(filePath);
      }

      return services;
    },
    {}, // Initial value of the services object
  );
};

module.exports = initializeServices();
