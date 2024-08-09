const { Router } = require('express');
const { forEach } = require('lodash');
const { bookController } = require('../controllers');
const { validateRequestMiddleware } = require('../middlewares');
const { bookValidation } = require('../validators');

const router = Router();

const { fetchByOffsetBasedPagination, fetchByCursorBasedPaginated, fetchByRawQuery } = bookValidation;

const { fetchByOffsetBasedPaginationHandler, fetchByCursorBasedPaginatedHandler, fetchByCursorBasedArbitraryPaginatedHandler, fetchByRawQueryHandler } = bookController;

const routes = [
  { path: '/offset', method: 'get', middlewares: [validateRequestMiddleware(fetchByOffsetBasedPagination)], handler: fetchByOffsetBasedPaginationHandler },
  { path: '/cursor', method: 'get', middlewares: [validateRequestMiddleware(fetchByCursorBasedPaginated)], handler: fetchByCursorBasedPaginatedHandler },
  { path: '/cursor/arbitrary', method: 'get', middlewares: [validateRequestMiddleware(fetchByCursorBasedPaginated)], handler: fetchByCursorBasedArbitraryPaginatedHandler },
  { path: '/raw/query', method: 'post', middlewares: [validateRequestMiddleware(fetchByRawQuery)], handler: fetchByRawQueryHandler },
];

forEach(routes, ({ path, method, middlewares, handler }) => {
  router[method](path, ...middlewares, handler);
});

module.exports = router;
