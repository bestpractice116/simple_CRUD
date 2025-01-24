const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Item = sequelize.define(
  'Item',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'items',
    timestamps: false
  }
);

Item.associate = function (models) {
  Item.belongsToMany(models.EstimatesInvoice, {
    through: 'EstimatesInvoiceItem',
    foreignKey: 'item_id',
    otherKey: 'estimates_invoice_id',
    as: 'estimatesInvoices',
    attributes: ['quantity']
  });
  Item.belongsTo(models.Unit, { foreignKey: 'unit_id' });
  Item.belongsTo(models.Tax, { foreignKey: 'taxId' });
};

module.exports = Item;
