const Joi = require('joi');

const limit = Joi.number().positive().min(1).max(100).default(10);

const fetchByOffsetBasedPagination = {
  query: Joi.object({
    page: Joi.number().positive().default(1),
    limit,
  }),
};

const fetchByCursorBasedPaginated = {
  query: Joi.object({
    limit,
    nextToken: Joi.string().allow('').optional(),
  }),
};

module.exports = {
  fetchByOffsetBasedPagination,
  fetchByCursorBasedPaginated,
};
