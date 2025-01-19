const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define(
  'Status',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'statuses',
    timestamps: false
  }
);

module.exports = Status;
