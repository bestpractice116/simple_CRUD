const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Unit extends Model {}

Unit.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Unit',
    tableName: 'units', // Assuming the table name is 'units'
    underscored: true // Optional: for snake_case column names
  }
);

module.exports = Unit;
