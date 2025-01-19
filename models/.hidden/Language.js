const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Language = sequelize.define('Language', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'languages',
  timestamps: false,
});

module.exports = Language;
