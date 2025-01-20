// 'use strict';

const sequelize = require('../config/database');
const fs = require('node:fs');
const path = require('path');
const db = {};

// Get the current directory where index.js is located
const modelsDirectory = __dirname;

// Read all files in the directory and require them
const files = fs
  .readdirSync(modelsDirectory)
  .filter((file) => file.endsWith('.js') && file !== 'index.js');

for (const file of files) {
  const model = require(path.join(modelsDirectory, file));
  db[model.name] = model;
}
// Sync models with the database
sequelize
  .sync({ force: false, alter: true }) // Use `force: true` only in development for testing
  .then(() => console.log('Database synced'))
  .catch((error) => console.error('Error syncing database:', error));

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// module.exports = db;
// const sequelize = require('../config/database');
// const User = require('./User');
// const Client=require('./Client');

// Sync models with the database
// sequelize.sync({ force: true }) // Use `force: true` only in development for testing
//   .then(() => console.log('Database synced'))
//   .catch((error) => console.error('Error syncing database:', error));

// module.exports = { User, Client};
