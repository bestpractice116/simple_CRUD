const Roles = require('../../models/Roles');

class RolePermissionService {
  async updateRolePermissions(id, permissionIds) {
    const role = await Roles.findByPk(id);
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await User.findAll({
        where: { id: permissionIds }
      });
      if (permissions.length !== permissionIds.length) {
        throw new Error('Some permissions not found');
      }

      await role.setRolePermissions(permissions);
    }
    await role.save();
    return { message: 'Role Permission updated successfully', role };
  }
}

module.exports = new RolePermissionService();