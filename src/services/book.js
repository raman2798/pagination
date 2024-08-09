const { isEqual, size, get } = require('lodash');
const { Op } = require('sequelize');
const { Book } = require('../models');

const fetchByOffsetBasedPagination = async (limit, offset) => {
  const books = await Book.findAndCountAll({
    order: [
      ['published', 'ASC'],
      ['id', 'ASC'],
    ],
    offset,
    limit,
  });

  return books;
};

const fetchBooks = ({ whereClause, orderClause, limit }) =>
  Book.findAll({
    where: whereClause,
    order: orderClause,
    limit,
  });

const fetchByCursorBasedPaginated = async (limit, nextToken) => {
  limit = parseInt(limit, 10);

  let whereClause = {};

  const orderClause = [['id', 'ASC']];

  if (nextToken) {
    whereClause = {
      id: {
        [Op.gt]: nextToken,
      },
    };
  }

  const books = await fetchBooks({ whereClause, orderClause, limit });

  let newNextToken = null;

  const bookLength = size(books);

  if (isEqual(bookLength, limit)) {
    const lastBook = books[bookLength - 1];

    newNextToken = get(lastBook, 'id');
  }

  return {
    rows: books,
    nextToken: newNextToken,
  };
};

const fetchByCursorBasedArbitraryPaginated = async (limit, nextToken) => {
  limit = parseInt(limit, 10);

  let whereClause = {};

  const orderClause = [
    ['published', 'ASC'],
    ['id', 'ASC'],
  ];

  if (nextToken) {
    const [lastId, lastPublished] = nextToken.split(',');

    whereClause = {
      [Op.or]: [
        {
          published: {
            [Op.gt]: lastPublished,
          },
        },
        {
          [Op.and]: [
            {
              published: lastPublished,
            },
            {
              id: {
                [Op.gt]: lastId,
              },
            },
          ],
        },
      ],
    };
  }

  const books = await fetchBooks({ whereClause, orderClause, limit });

  let newNextToken = null;

  const bookLength = size(books);

  if (isEqual(bookLength, limit)) {
    const lastBook = books[bookLength - 1];

    newNextToken = `${get(lastBook, 'id')},${get(lastBook, 'published')}`;
  }

  return {
    rows: books,
    nextToken: newNextToken,
  };
};

module.exports = {
  fetchByOffsetBasedPagination,
  fetchByCursorBasedPaginated,
  fetchByCursorBasedArbitraryPaginated,
};
