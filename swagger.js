const swaggerJsDoc = require('swagger-jsdoc');
var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API Documentation',
      version: '1.0.0',
      description: 'API documentation for my Express.js backend'
    }
  },
  apis: [
    './index.js',
    './src/router/*.js',
    './src/controller/*.js',
    './src/services/*.js',
    './src/middleware/*.js'
  ]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
