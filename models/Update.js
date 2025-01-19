const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Update extends Model {}

Update.init(
  {
    version: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Update',
    tableName: 'updates', // Assuming the table name is 'updates'
    underscored: true // Optional: for snake_case column names
  }
);

module.exports = Update;
