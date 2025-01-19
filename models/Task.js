const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed
const Status = require('./Status');
const User = require('./User');
const Workspace = require('./Workspace');
const Client = require('./Client');
const Tag = require('./Tag');

class Task extends Model {}

Task.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    due_date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    time_spent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estimated_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    underscored: true
  }
);
// Relationship with Status
Task.belongsTo(Status, {
  foreignKey: 'status_id',
  as: 'taskStatus'
});
Status.hasMany(Task, {
  foreignKey: 'status_id',
  as: 'statusTask'
});

// Many-to-many relationship with User
const Task_Users = sequelize.define('task_users', {}, { timestamps: false });

Task.belongsToMany(User, {
  through: Task_Users,
  as: 'assignedTaskUser',
  onDelete: 'CASCADE'
});
User.belongsToMany(Task, {
  through: Task_Users,
  as: 'assignedUserTask'
});

// Relationship with Workspace
Task.belongsTo(Workspace, {
  foreignKey: 'workspace_id',
  as: 'taskWorkspace'
});
Workspace.hasMany(Task, {
  foreignKey: 'workspace_id',
  as: 'workspaceTask'
});

// Relationship with Client (Creator)
Task.belongsTo(Client, {
  foreignKey: 'created_by',
  as: 'taskClient'
});
Client.hasMany(Task, {
  foreignKey: 'created_by',
  as: 'clientTask',
  onDelete: 'CASCADE'
});

//Relationship with Tag
const Task_Tags = sequelize.define('task_tags', {}, { timestamps: false });
Task.belongsToMany(Tag, {
  through: Task_Tags,
  as: 'assignedTaskTag',
  onDelete: 'CASCADE'
});
Tag.belongsToMany(Task, {
  through: Task_Tags,
  as: 'assignedTagTask',
  onDelete: 'CASCADE'
});

//Favorite relation between task and user
const UserFavorTask = sequelize.define(
  'user_favor_tasks',
  {},
  { timestamps: false }
);
Task.belongsToMany(User, {
  through: UserFavorTask,
  as: 'favoriteTaskUser',
  onDelete: 'CASCADE'
});
User.belongsToMany(Task, {
  through: UserFavorTask,
  as: 'favoriteUserTask',
  onDelete: 'CASCADE'
});

//Favorite relation between task and user
const ClientFavorTask = sequelize.define(
  'client_favor_tasks',
  {},
  { timestamps: false }
);
Task.belongsToMany(Client, {
  through: ClientFavorTask,
  as: 'favoriteTaskClient',
  onDelete: 'CASCADE'
});
Client.belongsToMany(Task, {
  through: ClientFavorTask,
  as: 'favoriteClientTask',
  onDelete: 'CASCADE'
});

module.exports = Task;
