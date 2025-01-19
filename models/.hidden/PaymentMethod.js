const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'payment_methods',
  timestamps: false,
});

PaymentMethod.associate = function(models) {
  PaymentMethod.hasMany(models.Payslip, { foreignKey: 'payment_method_id' });
  PaymentMethod.hasMany(models.Payment, { foreignKey: 'payment_method_id' });
};

module.exports = PaymentMethod;
