const { BAD_REQUEST } = require('http-status');
const { get, reduce, isString } = require('lodash');

/**
 * Extracts the first non-null or non-undefined value found in the specified paths within an object.
 * @param {Object} source - The object to search.
 * @param {Array<string>} paths - The list of paths to search within the object.
 * @param {(string|number)} defaultValue - The value to return if no value is found in the paths.
 * @returns {(string|number)} - The first non-null/non-undefined value found or the default value.
 */
const getFirstValidValue = (source, paths, defaultValue) => reduce(paths, (result, path) => result || get(source, path, defaultValue), null);

/**
 * Formats an error object into a standardized response object.
 * @param {Object} error - The error object to format.
 * @returns {Object} - An object containing a status code and a message.
 * @property {number} statusCode - The HTTP status code of the error.
 * @property {string} message - The error message.
 */
const createErrorResponse = (error) => {
  // Paths to search for the status code in the error object
  const STATUS_CODE_PATHS = ['response.status', 'statusCode'];

  // Paths to search for the error message in the error object
  const ERROR_MESSAGE_PATHS = ['response.data.message', 'errors[0].message', 'message'];

  // Extract the status code or use BAD_REQUEST if not found
  const statusCode = getFirstValidValue(error, STATUS_CODE_PATHS, BAD_REQUEST);

  // Extract the generic error message or use an empty string if not found
  const genericErrorMessage = getFirstValidValue(error, ERROR_MESSAGE_PATHS, '');

  // Fallback error message in case no generic error message is found
  const fallbackErrorMessage = new Error(JSON.stringify(error)).message || '';

  // Use the generic error message if available, otherwise use the fallback message
  const errorMessage = genericErrorMessage || fallbackErrorMessage;

  // Ensure the error message is a string
  const message = isString(errorMessage) ? errorMessage : JSON.stringify(errorMessage);

  // Return the standardized error response object
  return {
    statusCode,
    message,
  };
};

module.exports = createErrorResponse;
