const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define(
  'Profile',
  {},
  {
    tableName: 'profiles',
    timestamps: false
  }
);

Profile.associate = function (models) {
  Profile.belongsTo(models.User, {
    foreignKey: 'profileable_id',
    constraints: false,
    as: 'profileable'
  });
};

module.exports = Profile;
