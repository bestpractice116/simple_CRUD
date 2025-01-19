// services/workspaceService.js
const Workspace = require('../models/Workspace'); // Adjust path if needed
const User = require('../models/User'); // Adjust path if needed

class WorkspaceService {
  // Create a new workspace
  static async createWorkspace(data) {
    try {
      const workspace = await Workspace.create(data);
      return workspace;
    } catch (error) {
      throw error;
    }
  }

  // Get all workspaces
  static async getAllWorkspaces() {
    try {
      const workspaces = await Workspace.findAll();
      return workspaces;
    } catch (error) {
      throw error;
    }
  }

  // Get a single workspace by ID
  static async getWorkspaceById(id) {
    try {
      const workspace = await Workspace.findByPk(id);
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      return workspace;
    } catch (error) {
      throw error;
    }
  }

  // Add a user to a workspace
  static async addUserToWorkspace(workspace_id, user_id) {
    try {
      // Find the workspace by primary key
      const workspace = await Workspace.findByPk(workspace_id);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      // Find the user by ID
      const user = await User.findByPk(user_id);
      if (!user) {
        throw new Error('User not found');
      }

      // Add the user to the workspace using the many-to-many relationship
      await workspace.addUser(user); // This adds the user to the workspace

      return { message: 'User added to workspace successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Update workspace
  static async updateWorkspace(id, data) {
    try {
      const workspace = await Workspace.findByPk(id);
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      await workspace.update(data);
      return workspace;
    } catch (error) {
      throw error;
    }
  }

  // Delete workspace
  static async deleteWorkspace(id) {
    try {
      const workspace = await Workspace.findByPk(id);
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      await workspace.destroy();
      return { message: 'Workspace deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WorkspaceService;
