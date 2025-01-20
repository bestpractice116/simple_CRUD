const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Express API Documentation',
    description: 'Automatically generated API documentation'
  },
  schemes: ['http'] // Use https if applicable
};

const outputFile = './swagger-output.json'; // File to write Swagger spec
const endpointsFiles = [
  './index.js',
  './src/router/*.js',
  './src/controller/*.js',
  './src/services/*.js',
  './src/middleware/*.js'
]; // Your root file or routes files

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  // Run the server after the documentation is generated
  // require('./index'); // Adjust to your entry point file
});
