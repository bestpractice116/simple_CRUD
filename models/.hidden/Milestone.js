const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Milestone = sequelize.define(
  'Milestone',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'milestones',
    timestamps: false
  }
);

Milestone.associate = function (models) {
  Milestone.belongsTo(models.Project, { foreignKey: 'project_id' });
};

module.exports = Milestone;
