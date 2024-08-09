const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const { bookService } = require('../services');
const { transformErrorUtilities, transformResponseUtilities } = require('../utilities');

const { fetchByOffsetBasedPagination, fetchByCursorBasedPaginated, fetchByCursorBasedArbitraryPaginated } = bookService;

const fetchByOffsetBasedPaginationHandler = async (req, res, next) => {
  try {
    const {
      query: { limit = 10, page },
    } = req;

    const offset = (page - 1) * limit;

    const response = await fetchByOffsetBasedPagination(limit, offset);

    res.json(transformResponseUtilities({ data: response }));
  } catch (error) {
    next(transformErrorUtilities(error));
  }
};

const fetchByCursorBasedPaginatedHandler = async (req, res, next) => {
  try {
    const {
      query: { limit = 10, nextToken },
    } = req;

    const response = await fetchByCursorBasedPaginated(limit, nextToken);

    res.json(transformResponseUtilities({ data: response }));
  } catch (error) {
    next(transformErrorUtilities(error));
  }
};

const fetchByCursorBasedArbitraryPaginatedHandler = async (req, res, next) => {
  try {
    const {
      query: { limit = 10, nextToken },
    } = req;

    const response = await fetchByCursorBasedArbitraryPaginated(limit, nextToken);

    res.json(transformResponseUtilities({ data: response }));
  } catch (error) {
    next(transformErrorUtilities(error));
  }
};

const fetchByRawQueryHandler = async (req, res, next) => {
  try {
    const { query } = req.body;

    const books = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    res.json(transformResponseUtilities({ data: books }));
  } catch (error) {
    next(transformErrorUtilities(error));
  }
};

module.exports = {
  fetchByOffsetBasedPaginationHandler,
  fetchByCursorBasedPaginatedHandler,
  fetchByCursorBasedArbitraryPaginatedHandler,
  fetchByRawQueryHandler
};
