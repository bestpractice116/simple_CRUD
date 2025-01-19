const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Setting = sequelize.define('Setting', {
  variable: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'settings',
  timestamps: false,
});

module.exports = Setting;
