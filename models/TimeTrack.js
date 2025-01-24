const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed
const User = require('./User');
const Client = require('./Client');
const Task = require('./Task');
const Project = require('./Project');

class TimeTrack extends Model {}

TimeTrack.init(
  {
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimated_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'TimeTrack',
    tableName: 'time_track',
    underscored: true
  }
);
// Relationship with Status
Task.hasMany(TimeTrack, {
  foreignKey: 'task_id',
  as: 'taskTimeTrack'
});
TimeTrack.belongsTo(Task, {
  foreignKey: 'task_id',
  as: 'timeTrackTask'
});

Project.hasMany(TimeTrack, {
  foreignKey: 'project_id',
  as: 'projectTimeTrack'
});
TimeTrack.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'timeTrackProject'
});

User.hasMany(TimeTrack, { foreignKey: 'user_id', as: 'userTimeTrack' });
TimeTrack.belongsTo(User, { foreignKey: 'user_id', as: 'timeTrackUser' });

Client.hasMany(TimeTrack, { foreignKey: 'client_id', as: 'clientTimeTrack' });
TimeTrack.belongsTo(Client, { foreignKey: 'client_id', as: 'timeTrackClient' });

module.exports = TimeTrack;
