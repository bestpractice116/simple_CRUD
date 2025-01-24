const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Allowance = sequelize.define(
  'Allowance',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'allowances',
    timestamps: false
  }
);

Allowance.associate = function (models) {
  Allowance.belongsToMany(models.Payslip, {
    through: 'AllowancePayslip',
    where: { 'payslips.workspace_id': sequelize.literal('workspace_id') }
  });
};

module.exports = Allowance;
