const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const LeaveEditor = sequelize.define('LeaveEditor', {}, {
  tableName: 'leave_editors',
  timestamps: false,
});

LeaveEditor.associate = function(models) {
  LeaveEditor.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = LeaveEditor;
