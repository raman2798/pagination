const Joi = require('joi');

const limit = Joi.number().positive().min(1).max(100).default(10).label('Limit');

const fetchByOffsetBasedPagination = {
  query: Joi.object({
    page: Joi.number().positive().default(1).label('Page Number'),
    limit,
  }),
};

const fetchByCursorBasedPaginated = {
  query: Joi.object({
    limit,
    nextToken: Joi.string().trim().allow('').optional().label('Next Token'),
  }),
};

const fetchByRawQuery = {
  body: Joi.object({
    query: Joi.string().min(1).trim().required().label('Raw Query'),
  }),
};

module.exports = {
  fetchByOffsetBasedPagination,
  fetchByCursorBasedPaginated,
  fetchByRawQuery,
};
