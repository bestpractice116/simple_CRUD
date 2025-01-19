const TaskService = require('../services/TaskService');
const roleService = require('../services/roleService');

const { getAuthenticatedUser } = require('../middleware/verifyUser');
require('../middleware/verifyUser');

class TaskController {
  //Create Task.
  async createTask(req, res) {
    try {
      const Task = await TaskService.createTask(req.body);
      res.status(201).json(Task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTasks(req, res) {
    try {
      const Tasks = await TaskService.getAllTasks();
      res.status(200).json(Tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTasksInProgress(req, res) {
    try {
      const Tasks = await TaskService.getTasksInProgress();
      res.status(200).json(Tasks.count);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllTasksForUser(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const Tasks = await TaskService.getAllTasksForUser(userinfo.id);
      res.status(200).json(Tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllTasksForClient(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const Tasks = await TaskService.getAllTasksForClient(userinfo.id);
      res.status(200).json(Tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getAllTasksByUserEmail(req, res) {
    try {
      const Tasks = await TaskService.getAllTasksByUserEmail(req.body.email);
      res.status(200).json(Tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTaskById(req, res) {
    try {
      const Task = await TaskService.getTaskById(req.params.id);
      res.status(200).json(Task);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const updatedTask = await TaskService.updateTask(req.query.id, req.body);
      res
        .status(200)
        .json({ message: 'Task updated successfully', Task: updatedTask });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const { taskId } = req.query;
      await TaskService.deleteTask(taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  //Fovourite Task Control
  // get all, add favour, remove favour
  async getAllFavouriteTasks(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      let Tasks;
      if (
        userinfo.role == 'admin' ||
        userinfo.role == 'member' ||
        userinfo.role == 'manager'
      ) {
        Tasks = await TaskService.getAllFavouriteTaskForUser(userinfo.id);
      } else {
        Tasks = await TaskService.getAllFavouriteTaskForClient(userinfo.id);
      }
      res.status(200).json(Tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addFavouriteTask(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const message = await TaskService.addFavouriteTask(
        userinfo,
        req.body.taskId
      );
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeFavouriteTask(req, res) {
    try {
      const userinfo = getAuthenticatedUser(req);
      const message = await TaskService.removeFavouriteTask(
        userinfo,
        req.body.taskId
      );
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TaskController();
