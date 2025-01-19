//Define each Users role.

// models/ModelRole.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your actual database config path

const ModelRole = sequelize.define(
  'ModelRole',
  {
    model_id: {
      type: DataTypes.INTEGER.UNSIGNED, // BIGINT(20) UNSIGNED
      allowNull: false // Ensures this field is required
    },
    model_type: {
      type: DataTypes.STRING(191), // VARCHAR(191)
      allowNull: false // Ensures this field is required
    },
    role_id: {
      type: DataTypes.INTEGER, // BIGINT(20) UNSIGNED
      allowNull: false, // Ensures this field is required
      references: {
        model: 'roles', // Refers to the 'roles' table
        key: 'id' // Refers to the 'id' column in 'roles'
      },
      onDelete: 'CASCADE', // Handles cascading deletion
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'ModelRole',
    tableName: 'model_roles', // Explicitly set the table name
    timestamps: false, // Disable automatic timestamps (since they aren't mentioned)
    indexes: [
      {
        unique: true,
        fields: ['model_id', 'model_type'] // Ensure unique combinations of model_id and model_type
      }
    ]
  }
);

module.exports = ModelRole;
