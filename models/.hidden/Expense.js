const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define(
  'Expense',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expense_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'expenses',
    timestamps: false
  }
);

module.exports = Expense;
