const fs = require('fs');
const { resolve, basename } = require('path');
const { camelCase, endsWith, reduce, startsWith } = require('lodash');

const validationsFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidValidationFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize validations
const initializeValidations = () => {
  // Read all files in the validations directory
  const files = fs.readdirSync(validationsFolder);

  // Construct validations object
  return reduce(
    files,
    (validations, file) => {
      if (isValidValidationFile(file)) {
        // Generate validation name from filename
        const validationName = `${camelCase(basename(file, '.js'))}Validation`;

        // Resolve full path to the validation file
        const filePath = resolve(validationsFolder, file);

        // Assign validation to the object
        validations[validationName] = require(filePath);
      }

      return validations;
    },
    {}, // Initial value of the validations object
  );
};

module.exports = initializeValidations();
