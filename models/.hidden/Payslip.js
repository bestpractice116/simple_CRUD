const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payslip = sequelize.define('Payslip', {
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  working_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lop_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paid_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  basic_salary: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  leave_deduction: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  ot_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ot_rate: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  ot_payment: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  total_allowance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  incentives: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  bonus: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  total_earnings: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  total_deductions: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  netPay: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'payslips',
  timestamps: false,
});

Payslip.associate = function(models) {
  Payslip.belongsToMany(models.Allowance, {
    through: 'PayslipAllowance',
    foreignKey: 'payslip_id',
    otherKey: 'allowance_id',
    as: 'allowances',
  });
  Payslip.belongsToMany(models.Deduction, {
    through: 'PayslipDeduction',
    foreignKey: 'payslip_id',
    otherKey: 'deduction_id',
    as: 'deductions',
  });
};

module.exports = Payslip;
