const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContractType = sequelize.define('ContractType', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'contract_types',
  timestamps: false,
});

ContractType.associate = function(models) {
  ContractType.hasMany(models.Contract, { foreignKey: 'contract_type_id' });
};

module.exports = ContractType;
