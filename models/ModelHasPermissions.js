// models/ModelHasPermissions.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your actual database config path

const ModelHasPermissions = sequelize.define(
  'ModelHasPermissions',
  {
    permission_id: {
      type: DataTypes.INTEGER, // bigint(20) unsigned
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id'
      },
      onDelete: 'CASCADE', // Handles cascading deletion
      onUpdate: 'CASCADE'
    },
    model_type: {
      type: DataTypes.STRING(191), // varchar(191)
      allowNull: false
    },
    model_id: {
      type: DataTypes.INTEGER, // bigint(20) unsigned
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ModelHasPermissions',
    tableName: 'model_has_permissions', // Explicitly set the table name
    timestamps: false // Disable automatic timestamps
  }
);

module.exports = ModelHasPermissions;
