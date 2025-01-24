const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Tax extends Model {}

Tax.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER(10, 2),
      allowNull: false
    },
    percentage: {
      type: DataTypes.INTEGER(5, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Tax',
    tableName: 'taxes', // Assuming the table name is 'taxes'
    underscored: true // Optional: for snake_case column names
  }
);

module.exports = Tax;
