const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your actual database config path

const Roles = sequelize.define(
  'Roles',
  {
    name: {
      type: DataTypes.STRING(191), // varchar(191)
      allowNull: false // Ensures this field is required
    },
    guard_name: {
      type: DataTypes.STRING(191), // varchar(191)
      allowNull: false // Ensures this field is required
    }
  },
  {
    sequelize,
    modelName: 'Roles',
    tableName: 'roles', // Explicitly set the table name as 'roles'
    timestamps: true // Enable created_at and updated_at
  }
);

module.exports = Roles;
