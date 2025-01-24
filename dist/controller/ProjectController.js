const ProjectService = require('../services/ProjectService');
const roleService = require('../services/roleService');

const { getAuthenticatedUser } = require('../middleware/verifyUser');
require('../middleware/verifyUser');

class ProjectController {
  async createProject(req, res) {
    try {
      const Project = await ProjectService.createProject(req.body);
      res.status(201).json({ message: 'Project created successfully', Project });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllProjects(req, res) {
    try {
      const projects = await ProjectService.getAllProjects();
      console.log(projects);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getActiveProjects(req, res) {
    try {
      const Projects = await ProjectService.activeProjects();
      res.status(200).json(Projects.count);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllProjectsForUser(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const Projects = await ProjectService.getAllProjectsForUser(userinfo.id);
      // console.log(Projects);
      res.status(200).json(Projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllProjectsForClient(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const Projects = await ProjectService.getAllProjectsForClient(userinfo.id);
      res.status(200).json(Projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProjectById(req, res) {
    try {
      const Project = await ProjectService.getProjectById(req.body.projectId);
      res.status(200).json(Project);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
  async getAllProjectByUserEmail(req, res) {
    try {
      const Project = await ProjectService.getAllProjectByUserEmail(req.body.email);
      res.status(200).json(Project);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProject(req, res) {
    try {
      const updatedProject = await ProjectService.updateProject(req.query.id, req.body);
      res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      const { projectId } = req.query;
      await ProjectService.deleteProject(projectId);
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  //Fovourite Project Control
  // get all, add favour, remove favour
  async getAllFavouriteProjects(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      let Projects;
      if (userinfo.role == 'admin' || userinfo.role == 'member' || userinfo.role == 'manager') {
        Projects = await ProjectService.getAllFavouriteProjectForUser(userinfo.id);
      } else {
        Projects = await ProjectService.getAllFavouriteProjectForClient(userinfo.id);
      }
      res.status(200).json(Projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addFavouriteProject(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const message = await ProjectService.addFavouriteProject(userinfo, req.body.projectId);
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeFavouriteProject(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const message = await ProjectService.removeFavouriteProject(userinfo, req.body.projectId);
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProjectController();