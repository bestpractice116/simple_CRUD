const Roles = require('../../models/Roles'); // Assuming Role is defined in Sequelize models
const ModelRole = require('../../models/ModelRole');
const Permissions = require('../../models/Permission');
const { getAuthenticatedUser } = require('./verifyUser');
const User = require('../../models/User');
const Client = require('../../models/Client');

require('./verifyUser');
/**
 * Middleware to handle user access control (UAC) permissions.
 * @param {...string} permissions - List of allowed permissions.
 * @returns {Function} Middleware function.
 */
const roleVerify = userrole => {
  return async (req, res, next) => {
    try {
      const user = getAuthenticatedUser(req);
      console.log(user);
      const role = await Roles.findOne({
        where: { name: user.role // Assuming association is defined
        } });
      if (!role) {
        return res.status(403).json({ message: 'Forbidden!' });
      }

      let users = await User.findOne({ where: { email: user.email } });
      let model_type = 'user';
      if (!users) {
        users = Client.findOne({ where: { where: { email: user.email } } });
        model_type = 'client';
      }
      if (!users) {
        return res.status(403).json({ message: 'Forbidden!' });
      }
      const roles = await ModelRole.findOne({
        where: { model_id: users.id, model_type: model_type }
      });
      if (user.role_id !== roles.role_id) return res.status(403).json({ message: 'Forbidden!' });

      if (user.role !== userrole) return res.status(403).json({ message: 'Forbidden!' });
      next();
    } catch (error) {
      console.error('Role Verify Error:', error);
      res.sendStatus(500);
    }
  };
};

module.exports = roleVerify;