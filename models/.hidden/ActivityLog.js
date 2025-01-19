const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  actor_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parent_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'activity_logs',
  timestamps: false, // Assuming you're managing created_at/updated_at manually
});

ActivityLog.associate = function(models) {
  // Define relationships if needed
  // For example, linking the ActivityLog to a specific Workspace, User (Actor), etc.
  // ActivityLog.belongsTo(models.Workspace, { foreignKey: 'workspace_id' });
};

module.exports = ActivityLog;
