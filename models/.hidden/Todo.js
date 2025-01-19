const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as needed

class Todo extends Model {}

Todo.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING, // Adjust the data type if needed (e.g., 'low', 'medium', 'high')
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creator_type: {
      type: DataTypes.STRING, // To store the polymorphic type (e.g., User, Admin)
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Todo',
    tableName: 'todos', // Assuming the table name is 'todos'
    underscored: true,  // Optional: for snake_case column names
  }
);

module.exports = Todo;
