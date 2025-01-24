const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');
const Status = require('./Status');
const Task = require('./Task');
const Tag = require('./Tag');
const Workspace = require('./Workspace');

const Project = sequelize.define(
  'Project',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    package_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    monthly_hours: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true
    },
    package_level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    services: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    project_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rollover: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    portal_access: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additional_setting: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'projects',
    timestamps: false
  }
);

//Project-Tags associations
const Project_Tags = sequelize.define(
  'project_tags',
  {},
  { timestamps: false }
);
Project.belongsToMany(Tag, {
  through: Project_Tags,
  as: 'assignedProjectTag',
  onDelete: 'CASCADE'
});
Tag.belongsToMany(Project, {
  through: Project_Tags,
  as: 'assignedTagProject'
});

//Project-task associations
Project.hasMany(Task, {
  foreignKey: 'project_id',
  as: 'projectTask',
  onDelete: 'CASCADE'
});
Task.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'taskProject'
});

//Association between project and user.
const ProjectAssignUser = sequelize.define(
  'user_projects',
  {},
  { timestamps: false }
);
Project.belongsToMany(User, {
  through: ProjectAssignUser,
  as: 'assignedProjectUser',
  onDelete: 'CASCADE'
});
User.belongsToMany(Project, {
  through: ProjectAssignUser,
  as: 'assignedUserProject'
});
//Project-Client associations
const ClientRequestProject = sequelize.define(
  'client_projects',
  {
    state: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  { timestamps: false }
);
Project.belongsToMany(Client, {
  through: ClientRequestProject,
  as: 'requestedProjectClient',
  onDelete: 'CASCADE'
});
Client.belongsToMany(Project, {
  through: ClientRequestProject,
  as: 'requestedClientProject'
});

//Favorite relation between project and client
const ClientFavorPro = sequelize.define(
  'client_favor_projects',
  {
    state: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  { timestamps: false }
);
Project.belongsToMany(Client, {
  through: ClientFavorPro,
  as: 'favoriteClient',
  onDelete: 'CASCADE'
});
Client.belongsToMany(Project, {
  through: ClientFavorPro,
  as: 'favoriteProject'
});

//Favorite relation between project and user
const UserFavorPro = sequelize.define(
  'user_favor_projects',
  {},
  { timestamps: false }
);
Project.belongsToMany(User, {
  through: UserFavorPro,
  as: 'favoriteUser',
  onDelete: 'CASCADE'
});
User.belongsToMany(Project, {
  through: UserFavorPro,
  as: 'favoriteProject',
  onDelete: 'CASCADE'
});

//Set Status association to project
Project.belongsTo(Status, {
  foreignKey: 'status_id',
  as: 'status',
  onDelete: 'CASCADE'
});
Status.hasMany(Project, {
  foreignKey: 'status_id'
});

//Set association between project and workspace.
Project.belongsTo(Workspace, {
  foreignKey: 'workspace_id',
  as: 'workspace'
});
Workspace.hasMany(Project, {
  foreignKey: 'workspace_id'
});

// Project.hasMany(require('./MileStone'), {
//   foreignKey: 'project_id',
//   as: 'milestones',
// });

module.exports = Project;
