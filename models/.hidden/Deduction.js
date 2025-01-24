const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deduction = sequelize.define(
  'Deduction',
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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'deductions',
    timestamps: false
  }
);

Deduction.associate = function (models) {
  Deduction.belongsToMany(models.Payslip, {
    through: 'DeductionPayslip',
    where: { 'payslips.workspace_id': sequelize.literal('workspace_id') }
  });
};

module.exports = Deduction;
