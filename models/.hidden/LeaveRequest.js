const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
  from_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'leave_requests',
  timestamps: false,
});

module.exports = LeaveRequest;
