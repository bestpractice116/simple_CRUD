const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpenseType = sequelize.define('ExpenseType', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'expense_types',
  timestamps: false,
});

ExpenseType.associate = function(models) {
  ExpenseType.hasMany(models.Expense, { foreignKey: 'expense_type_id' });
};

module.exports = ExpenseType;
