const Joi = require('joi');
const dotenv = require('dotenv');
const { get, reduce } = require('lodash');

dotenv.config();

const allowedEnvironments = ['development', 'staging', 'test', 'uat', 'production'];

// Define the schema for the environment variables
const envSchema = Joi.object({
  DB_DATABASE: Joi.string().required().description('Database name'),
  DB_DIALECT: Joi.string().required().description('Database dialect'),
  DB_HOST: Joi.string().required().description('Database host'),
  DB_PASSWORD: Joi.string().required().description('Database password'),
  DB_PORT: Joi.string().required().description('Database port'),
  DB_USERNAME: Joi.string().required().description('Database username'),
  NODE_ENV: Joi.string()
    .valid(...allowedEnvironments)
    .required()
    .description('Application environment'),
  SERVER_PORT: Joi.number().default(5000).description('Server port'),
}).unknown();

// Validate and extract environment variables
const { value: envVars, error: validationError } = envSchema.validate(process.env, { errors: { label: 'key' } });

// Throw an error if validation fails
if (validationError) {
  const errorMessage = reduce(get(validationError, 'details'), (acc, { message }) => `${acc}, ${message.replace(/"/g, '')}`, '').slice(2);

  throw new Error(`Config validation error: ${errorMessage}`);
}

// Build the configuration object
const config = {
  allowedEnvironments,
  db: {
    database: get(envVars, 'DB_DATABASE'),
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
    dialect: get(envVars, 'DB_DIALECT'),
    host: get(envVars, 'DB_HOST'),
    password: get(envVars, 'DB_PASSWORD'),
    port: get(envVars, 'DB_PORT'),
    username: get(envVars, 'DB_USERNAME'),
    logging: false,
  },
  nodeEnv: get(envVars, 'NODE_ENV'),
  serverPort: get(envVars, 'SERVER_PORT'),
};

module.exports = config;
