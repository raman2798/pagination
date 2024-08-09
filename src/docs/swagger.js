const swaggerJsdoc = require('swagger-jsdoc');
const { appConfiguration } = require('../config');
const { description, version } = require('../../package.json');

const { serverPort } = appConfiguration;

const swaggerOptions = {
  openapi: '3.1.0',
  info: {
    title: 'Pagination API Docs',
    description,
    version,
  },
  servers: [
    {
      url: `http://localhost:${serverPort}/api`,
    },
  ],
};

const swaggerSpecs = swaggerJsdoc({
  swaggerDefinition: swaggerOptions,
  apis: ['src/docs/yml/**/*.yml'],
});

module.exports = { swaggerSpecs };
