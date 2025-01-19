const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your actual database config path
const Roles = require('./Roles');

const Permissions = sequelize.define(
  'Permissions',
  {
    name: {
      type: DataTypes.STRING(191), // varchar(191)
      allowNull: false // Ensures this field is required
    },
    guard_name: {
      type: DataTypes.STRING(191), // varchar(191)
      allowNull: false // Ensures this field is required
    }
  },
  {
    sequelize,
    modelName: 'Permissions',
    tableName: 'permissions', // Explicitly set the table name as 'permissions'
    timestamps: false // Disable automatic timestamps (created_at/updated_at)
  }
);
const RoleHasPermissions = sequelize.define(
  'role_has_permissions',
  {},
  { sequelize, timestamps: false }
);
Permissions.belongsToMany(Roles, {
  through: RoleHasPermissions,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'permissionsRole'
});
Roles.belongsToMany(Permissions, {
  through: RoleHasPermissions,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'rolePermissions'
});

module.exports = Permissions;
