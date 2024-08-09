const { reduce } = require('lodash');
const { allowedEnvironments, db } = require('./app');

const dbConfiguration = reduce(
  allowedEnvironments,
  (configs, environment) => {
    configs[environment] = db;

    return configs;
  },
  {},
);

module.exports = dbConfiguration;
