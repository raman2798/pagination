const fs = require('fs');
const { resolve, basename } = require('path');
const { camelCase, endsWith, reduce, startsWith } = require('lodash');

const configsFolder = resolve(__dirname);

// Check if the file ends with '.js' and does not start with 'index'
const isValidConfigFile = (file) => endsWith(file, '.js') && !startsWith(file, 'index');

// Function to initialize configs
const initializeConfigs = () => {
  // Read all files in the configs directory
  const files = fs.readdirSync(configsFolder);

  // Construct configs object
  return reduce(
    files,
    (configs, file) => {
      if (isValidConfigFile(file)) {
        // Generate config name from filename
        const configName = `${camelCase(basename(file, '.js'))}Configuration`;

        // Resolve full path to the config file
        const filePath = resolve(configsFolder, file);

        // Assign config to the object
        configs[configName] = require(filePath);
      }

      return configs;
    },
    {}, // Initial value of the configs object
  );
};

module.exports = initializeConfigs();
