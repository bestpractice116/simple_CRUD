const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

class Workspace extends Model {}

Workspace.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Workspace',
    tableName: 'workspaces',
    underscored: true
  }
);

// // Associations
// Workspace.belongsToMany(require('./User'), {
//   through: 'workspace_user'
// });
Workspace.belongsToMany(require('./Client'), {
  through: 'workspace_client'
});

// Workspace.hasMany(require('./Meeting'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Todo'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./LeaveRequest'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Payslip'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./.hidden/Contract'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./ContractType'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./PaymentMethod'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Allowance'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Deduction'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./TimeTracker'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Tax'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Unit'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./.hidden/Item'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./EstimatesInvoice'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Expense'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./ExpenseType'), { foreignKey: 'workspace_id' });
// Workspace.hasMany(require('./Payment'), { foreignKey: 'workspace_id' });

// Methods
Workspace.prototype.getResult = function () {
  return this.title.substring(0, 100);
};

module.exports = Workspace;
