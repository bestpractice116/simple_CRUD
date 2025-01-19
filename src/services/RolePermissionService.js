const Roles = require('../../models/Roles');

class RolePermissionService {
  async updateRolePermissions(id, permissionIds) {
    try {
      const role = await Roles.findByPk(id);
      // Step 3: Update Users (if userNames are provided as an array of usernames)
      if (permissionIds && permissionIds.length > 0) {
        // Find users by their names (assuming usernames are unique)
        const permissions = await User.findAll({
          where: { id: permissionIds }
        });
        if (permissions.length !== permissions.length) {
          throw new Error('Some permissions not found');
        }

        // Update the association with Permissions
        await role.setRolePermissions(permissions);
      }
      await role.save();
      return { message: 'Role Permission updated successfully', role };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RolePermissionService();
