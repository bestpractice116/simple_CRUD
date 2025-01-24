const User = require('../../models/User');
const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Tag = require('../../models/Tag');
const Task = require('../../models/Task');

class TaskService {
  //Create Task
  //Fundatmentally this role is only for admin and task manager.
  //To create Task we need client name, user name
  //Create the association between task and client and user
  async createTask(req) {
    const {
      title,
      require_time,
      projectId,
      description,
      priority,
      due_date,
      state
    } = req.data;

    if (req.client) {
      const client = await Client.findOne({ where: { full_name: req.client } });
      if (!client) throw new Error('Client not found');
    }

    const project = await Project.findByPk(projectId);
    if (!project) throw new Error('Project not found');

    const task = await Task.create({
      title,
      require_time,
      description,
      priority,
      due_date,
      state
    });
    // await task.setTaskClient(client);
    await task.setTaskProject(project);
    if (req.tags && req.tags.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const tags = await Tag.findAll({
        where: { title: req.tags }
      });
      if (tags.length !== req.tags.length) {
        throw new Error('Some tags not found');
      }
      await task.addAssignedTaskTag(tags);
    }

    if (req.members && req.members.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const users = await User.findAll({
        where: { id: req.members }
      });
      if (users.length !== req.members.length) {
        throw new Error('Some users not found');
      }
      await task.addAssignedTaskUser(users);
    }

    return { message: 'Task Successfully Created!' };
  }

  //Get all favourite task
  async getAllFavouriteTaskForUser(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'favoriteUserTask'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.favoriteUserTask;
  }

  async getAllFavouriteTaskForClient(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'favoriteClientTask'
      }
    });
    if (!user) throw new Error('Client not found!');
    return user.favoriteClientTask;
  }

  //Add Favourite Task
  async addFavouriteTask(userinfo, taskID) {
    const { email } = userinfo;
    const task = await Task.findByPk(taskID);
    if (!task) throw new Error('Task Not Found.');
    const user = await User.findOne({ where: { email } });
    if (user) await user.addFavoriteUserTask(task);
    const client = await Client.findOne({ where: { email } });
    if (client) await client.addFavoriteClientTask(task);
    if (!client && !user) throw new Error('User Not Found.');
    return { message: 'Favourite Task Successfully added.' };
  }

  async removeFavouriteTask(userinfo, taskID) {
    const { email } = userinfo;
    const task = await Task.findByPk(taskID);
    if (!task) {
      throw new Error('Task not found.');
    }
    const user = await User.findOne({ where: { email } });
    if (user) await user.removeFavoriteTask(task);
    const client = await Client.findOne({ where: { email } });
    if (client) await user.removeFavoriteTask(task);
    if (!client && !user) throw new Error('User Not Found.');
    return { message: 'Task Favour Successfully removed.' };
  }

  //Get all tasks with associated users and clients.
  async getAllTasksForClient(userId) {
    const user = await Client.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'requestedTaskClient'
          },
          {
            model: Project,
            as: 'taskProject'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'assignedTaskClient'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.requestedClientProject;
  }

  //Get all tasks with associated users and clients.
  async getAllTasksForUser(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Project,
            as: 'taskProject'
          }
        ],
        as: 'assignedUserTask'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.assignedUserTask;
  }

  //Get all tasks By Id
  async getAllTasksByUserEmail(email) {
    const user = User.findOne({ where: { email: email } });
    if (user) return await this.getAllTasksForUser(user.id);
    const client = Client.findOne({ where: { email: email } });
    if (client) return await this.getAllTasksForClient(client.id);
    if (!user && !client) throw new Error('User not Found!');
  }
  //Get all tasks.
  async getAllTasks() {
    return await Task.findAll({
      include: [
        {
          model: Project,
          as: 'taskProject',
          attributes: ['id', 'title']
        },
        {
          model: Client,
          as: 'taskClient',
          attributes: ['id', 'full_name']
        },
        {
          model: User,
          as: 'assignedTaskUser',
          attributes: ['id', 'full_name', 'role']
        }
      ]
    });
  }

  async getTasksInProgress() {
    return await Task.findAndCountAll({
      where: { state: 'inprogress' }
    });
  }

  async getTaskById(id) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'taskProject'
        },
        {
          model: Client,
          as: 'taskClient'
        },
        {
          model: User,
          as: 'assignedTaskUser'
        },
        {
          model: Tag,
          as: 'assignedTaskTag'
        }
      ]
    });
    if (!task) throw new Error('Task not found');
    return task;
  }

  async updateTask(id, updates) {
    const { client, users, tags } = updates;
    const task = await Task.findByPk(id);
    await task.update(updates);
    if (client) {
      const upclient = await Client.findOne({ where: { full_name: client } });
      if (!upclient) {
        throw new Error('Client not found.');
      }
      // Update the association with Client
      await task.setTaskClient([upclient]);
    }

    // Step 3: Update Users (if userNames are provided as an array of usernames)
    if (users && users.length > 0) {
      // Find users by their names (assuming usernames are unique)
      const upusers = await User.findAll({
        where: { full_name: users }
      });
      if (upusers.length !== users.length) {
        throw new Error('Some users not found');
      }
      if (tags && tags.length > 0) {
        // Find tags by their titles (assuming titles are unique)
        const uptags = await Tag.findAll({
          where: { title: req.tags }
        });
        if (uptags.length !== tags.length) {
          throw new Error('Some tags not found');
        }
        await Task.setAssignedTaskTag(tags);
      }

      // Update the association with Users
      await task.setAssignedTaskUser(upusers);
    }
    await task.save();
    return { message: 'Task updated successfully', task };
  }

  async deleteTask(id) {
    const task = await Task.findByPk(id);

    if (!task) {
      throw new Error('Task not found.');
    }
    // await task.setRequestedTaskClient([]);
    // await task.setAssignedUser([]);
    // await task.setFavoriteUser([]);
    // await task.setFavoriteClient([]);
    // await task.setAssignedTaskTag([]);
    await task.destroy();

    return { message: 'Task and its associations deleted successfully' };
  }

  async getProjectByTag(tagId) {
    const tag = await Tag.findByPk(tagId, {
      include: {
        model: Task,
        include: [
          {
            model: User,
            as: 'assignedTaskUser'
          },
          {
            model: Client,
            as: 'taskClient'
          },
          {
            model: Project,
            as: 'taskProject'
          },
          {
            model: Tag,
            as: 'assignedTaskTag'
          }
        ],
        as: 'assignedTagTask'
      }
    });
    if (!tag) throw new Error('Tag not found!');
    return tag.setAssignedTagTask;
  }
}

module.exports = new TaskService();
