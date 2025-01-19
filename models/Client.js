const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Client = sequelize.define(
  'Client',
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
    business_name: {
      type: DataTypes.STRING
    },
    personal_address: {
      type: DataTypes.STRING
    },
    business_address: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    preferred_contact_method: {
      type: DataTypes.STRING
    },
    timezone: {
      type: DataTypes.STRING
    },
    default_services: {
      type: DataTypes.STRING
    },
    other_services: {
      type: DataTypes.STRING
    },
    priorities: {
      type: DataTypes.STRING
    },
    support_hours: {
      type: DataTypes.STRING
    },
    use_tools: {
      type: DataTypes.STRING
    },
    access_specific: {
      type: DataTypes.STRING
    },
    file_share_method: {
      type: DataTypes.STRING
    },
    required_access: {
      type: DataTypes.STRING
    },
    often: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    receive_updates: {
      type: DataTypes.STRING
    },
    key_people: {
      type: DataTypes.STRING
    },
    particular_task: {
      type: DataTypes.STRING
    },
    start_date: {
      type: DataTypes.STRING
    },
    billing_method: {
      type: DataTypes.STRING
    },
    billing_cycle: {
      type: DataTypes.STRING
    },
    invoice_email: {
      type: DataTypes.STRING
    },
    emergency_contact_name: {
      type: DataTypes.STRING
    },
    emergency_contact_phone: {
      type: DataTypes.STRING
    },
    emergency_relationship: {
      type: DataTypes.STRING
    },
    digital_sign: {
      type: DataTypes.STRING
    },
    sign_date: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'clients',
    underscored: true
  }
);

// Associations

// Client.belongsToMany(require('./Meeting'), {
//   through: 'client_meeting',
// });
// Client.belongsToMany(require('./Workspace'), {
//   through: 'workspace_client',
// });
// Client.hasMany(require('./Note'), { foreignKey: 'creator_id' });
// Client.hasMany(require('./.hidden/Contract'), { foreignKey: 'client_id' });
// Client.hasMany(require('./Expense'), { foreignKey: 'created_by' });
// Client.hasMany(require('./Payment'), { foreignKey: 'created_by' });
// Methods
Client.prototype.getResult = function () {
  return `${this.first_name} ${this.last_name}`;
};

// Hooks for password hashing
Client.beforeCreate(async (client) => {
  if (client.password) {
    client.password = await bcrypt.hash(client.password, 10);
  }
});

// Static method for password comparison
Client.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = Client;
