/* eslint-disable no-unused-vars */
const { INTERNAL_SERVER_ERROR } = require('http-status');
const { get } = require('lodash');
const { loggerConfiguration } = require('../config');
const { transformResponseUtilities } = require('../utilities');

// Define the shape of the error response
const globalErrorHandler = (error, req, res, next) => {
  const statusCode = get(error, 'statusCode', INTERNAL_SERVER_ERROR);

  const message = get(error, 'message', 'Something went wrong. Please try again');

  loggerConfiguration.error('Error:', error);

  // Set the response status code and send the message as response
  res.status(statusCode).json(
    transformResponseUtilities({
      statusCode,
      message,
    }),
  );
};

module.exports = globalErrorHandler;
