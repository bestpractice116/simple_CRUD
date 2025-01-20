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
const UacPermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      const user = getAuthenticatedUser(req);
      console.log(user);
      const role = await Roles.findOne({
        where: { name: user.role // Assuming association is defined
        } });
      console.log(role.name);
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
      console.log(roles);
      console.log(user);
      if (user.role_id != roles.role_id) return res.status(403).json({ message: 'Forbidden!' });
      if (user.role != 'admin') {
        const roleMod = await Roles.findByPk(roles.role_id, {
          include: {
            model: Permissions,
            as: 'rolePermissions',
            attributes: ['name']
          }
        });
        // return res.json(roleMod.rolePermissions.map(item => item.name));
        const allowedPerms = [...permissions];
        if (!roleMod) return res.sendStatus(403);

        //Get names of rolePermission array.
        const ppermissions = roleMod.rolePermissions.map(item => item.name);

        const checkPermissions = ppermissions.some(async permission => {
          allowedPerms.includes(permission.name);
        });

        if (!checkPermissions) return res.sendStatus(403);
      }

      next();
    } catch (error) {
      console.error('UAC Permission Error:', error);
      res.sendStatus(500);
    }
  };
};

module.exports = UacPermission;