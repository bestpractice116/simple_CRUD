const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstimatesInvoice = sequelize.define(
  'EstimatesInvoice',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    personal_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    from_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    to_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tax_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    final_total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'estimates_invoices',
    timestamps: false
  }
);

EstimatesInvoice.associate = function (models) {
  EstimatesInvoice.belongsToMany(models.Item, {
    through: 'EstimatesInvoiceItem',
    foreignKey: 'estimates_invoice_id',
    otherKey: 'item_id',
    as: 'items',
    attributes: ['qty', 'unit_id', 'rate', 'taxId', 'amount']
  });
  EstimatesInvoice.hasMany(models.Payment, { foreignKey: 'invoice_id' });
};

module.exports = EstimatesInvoice;
