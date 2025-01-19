const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'User',
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    zip_code: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    ref_token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    underscored: true
  }
);

// Associations

// User.belongsToMany(require('./Meeting'), {
//   through: 'meeting_user',
// });
User.belongsToMany(require('./Workspace'), {
  through: 'workspace_user'
});
// User.hasMany(require('./LeaveRequest'), { foreignKey: 'user_id' });
// User.hasMany(require('./Note'), { foreignKey: 'creator_id' });
// User.hasMany(require('./TimeTracker'), { foreignKey: 'user_id' });
// User.hasMany(require('./Expense'), { foreignKey: 'user_id' });
// User.hasMany(require('./Payment'), { foreignKey: 'user_id' });

// Methods
User.prototype.getResult = function () {
  return `${this.first_name} ${this.last_name}`;
};

// Hooks for password hashing
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Static method for password comparison
User.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = User;
