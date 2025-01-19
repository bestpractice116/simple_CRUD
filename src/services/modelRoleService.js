const { ModelRole } = require('../models'); // Import the ModelRole model

// Create a new ModelRole
const create = async (data) => {
  return await ModelRole.create(data);
};

// Get all ModelRoles
const getAll = async () => {
  return await ModelRole.findAll();
};

// Get a ModelRole by ID
const getById = async (id) => {
  return await ModelRole.findByPk(id);
};

// Update a ModelRole by ID
const update = async (id, data) => {
  const modelRole = await ModelRole.findByPk(id);
  if (!modelRole) return null;

  return await modelRole.update(data);
};

// Delete a ModelRole by ID
const deleteModelRole = async (id) => {
  const modelRole = await ModelRole.findByPk(id);
  if (!modelRole) return null;

  await modelRole.destroy();
  return true;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteModelRole
};
