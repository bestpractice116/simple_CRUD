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

module.exports = Profile;
