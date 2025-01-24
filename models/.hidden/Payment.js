const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define(
  'Payment',
  {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'payments',
    timestamps: false
  }
);

Payment.associate = function (models) {
  Payment.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id' });
};

module.exports = Payment;
