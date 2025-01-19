const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meeting = sequelize.define('Meeting', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'meetings',
  timestamps: false,
});

Meeting.associate = function(models) {
  Meeting.belongsToMany(models.User, {
    through: 'meeting_user',
  });
  Meeting.belongsToMany(models.Client, {
    through: 'meeting_client',
  });
  Meeting.belongsTo(models.Workspace, { foreignKey: 'workspace_id' });
};

Meeting.prototype.getResult = function() {
  return this.title.substring(0, 100);
};

Meeting.prototype.getLink = function() {
  return '/meetings';
};

module.exports = Meeting;
