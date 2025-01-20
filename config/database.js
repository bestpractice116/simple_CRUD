const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Ensure port is provided
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true, // This forces SSL
        rejectUnauthorized: false // This bypasses certificate validation (useful if Render uses self-signed certificates)
      }
    }
  }
);

module.exports = sequelize;
