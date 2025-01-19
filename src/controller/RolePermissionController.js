const RolePermissionService = require('../services/RolePermissionService');
const roleService = require('../services/roleService');

const { getAuthenticatedUser } = require('../middleware/verifyUser');
require('../middleware/verifyUser');

class RolePermissionController {
  async updateRolePermission(req, res) {
    try {
      const { roleId, permissionIds } = req.body;
      const updatedRole = await RolePermissionService.updateRolePermissions(
        roleId,
        permissionIds
      );
      res
        .status(200)
        .json({ message: 'Project updated successfully', Role: updatedRole });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new RolePermissionController();
