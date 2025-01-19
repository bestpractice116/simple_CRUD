const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Tag extends Model {}

Tag.init(
  {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
      // unique: true, // Optional, if slug should be unique
    }
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags' // Adjust if table name differs
  }
);

module.exports = Tag;
