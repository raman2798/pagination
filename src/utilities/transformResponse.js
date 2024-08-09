const { OK } = require('http-status');

const transformResponse = (payload) => {
  const { message = 'Success', statusCode = OK, data = {} } = payload;

  return {
    data,
    ets: Date.now(),
    message,
    statusCode,
  };
};

module.exports = transformResponse;
