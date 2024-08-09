const fs = require('fs');
const { resolve, basename } = require('path');
const { camelCase, endsWith, reduce, startsWith } = require('lodash');

const utilitiesFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidUtilityFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize utilities
const initializeUtilities = () => {
  // Read all files in the utilities directory
  const files = fs.readdirSync(utilitiesFolder);

  // Construct utilities object
  return reduce(
    files,
    (utilities, file) => {
      if (isValidUtilityFile(file)) {
        // Generate utility name from filename
        const utilityName = `${camelCase(basename(file, '.js'))}Utilities`;

        // Resolve full path to the utility file
        const filePath = resolve(utilitiesFolder, file);

        // Assign utility to the object
        utilities[utilityName] = require(filePath);
      }

      return utilities;
    },
    {}, // Initial value of the utilities object
  );
};

module.exports = initializeUtilities();
