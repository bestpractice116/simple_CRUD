// services/roleService.js
const Roles = require('../../models/Roles'); // Import the Roles model

const getRoleById = async id => {
  try {
    const role = await Roles.findByPk(id);
    return role;
  } catch (error) {
    // biome-ignore lint/style/useTemplate: <explanation>
    throw new Error('Error fetching role: ' + error.message);
  }
};

const getRoleIdByName = async roleName => {
  try {
    const role = await Roles.findOne({
      where: { name: roleName // Search by role name
      } });
    return role.id; // Return the role_id (which is the same as 'id' in the database)
  } catch (error) {
    // biome-ignore lint/style/useTemplate: <explanation>
    throw new Error('Error fetching role by name: ' + error.message);
  }
};

module.exports = {
  getRoleById,
  getRoleIdByName
};