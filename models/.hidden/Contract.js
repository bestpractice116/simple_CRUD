const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Contract = sequelize.define(
  'Contract',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'contracts',
    timestamps: false
  }
);

Contract.associate = function (models) {
  Contract.belongsTo(models.Workspace, { foreignKey: 'workspace_id' });
  Contract.belongsTo(models.Client, { foreignKey: 'client_id' });
  Contract.belongsTo(models.User, { foreignKey: 'created_by' });
};

module.exports = Contract;
