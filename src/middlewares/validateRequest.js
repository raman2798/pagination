const { BAD_REQUEST } = require('http-status');
const Joi = require('joi');
const { get, reduce } = require('lodash');
const { pickUtilities } = require('../utilities');

const { pick } = pickUtilities;

/**
 * This function validates the request data against the provided schema
 * @param schema - The Joi schema to validate request against
 */
const validateRequest = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['headers', 'params', 'query', 'body']);

  // Pick only the relevant properties from the request object
  const object = pick(req, Object.keys(validSchema));

  // Check if 'headers' is specified in the schema
  if (validSchema.headers) {
    const { headers } = req;

    object.headers = headers;
  }

  // Compile and validate the object against the schema
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  // If there are validation errors, construct an error message
  if (error) {
    const errorMessage = reduce(get(error, 'details'), (acc, { message }) => `${acc}, ${message.replace(/"/g, '')}`, '').slice(2);

    // Pass the error to the error handler middleware
    return next({ statusCode: BAD_REQUEST, message: errorMessage });
  }

  // Assign the validated values to the request object
  Object.assign(req, value);

  // Proceed to the next middleware
  return next();
};

module.exports = validateRequest;
