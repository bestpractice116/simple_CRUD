const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as needed

class TimeTracker extends Model {}

TimeTracker.init(
  {
    start_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Assuming duration is in seconds or minutes, adjust as needed
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'TimeTracker',
    tableName: 'time_trackers', // Assuming the table name is 'time_trackers'
    underscored: true,  // Optional: for snake_case column names
  }
);

module.exports = TimeTracker;
