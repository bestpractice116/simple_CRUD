const User = require('../../models/User');
const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const TimeTrack = require('../../models/TimeTrack');
const Sequelize = require('sequelize');

class TimeTrackService {
  async createTimeTrack(req) {
    const {
      userId,
      taskId,
      clientId,
      projectId,
      start_time,
      end_time,
      estimated_time,
      title
    } = req;
    console.log(req);
    const client = await Client.findByPk(clientId);
    if (!client) throw new Error('Client not found');
    const project = await Project.findByPk(projectId);
    if (!project) throw new Error('Project not found');
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const timetrack = await TimeTrack.create({
      start_time,
      end_time,
      estimated_time,
      status: true,
      title
    });
    // await task.setTaskClient(client);
    await timetrack.setTimeTrackTask(task);
    await timetrack.setTimeTrackProject(project);
    await timetrack.setTimeTrackUser(user);
    await timetrack.setTimeTrackClient(client);
    return { message: 'TimeTrack Successfully Created!' };
  }

  //Get all tasks with associated users and clients.
  async getAllTimeTracksForUser(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: TimeTrack,
        include: [
          {
            model: Client,
            as: 'timeTrackClient'
          },
          {
            model: Project,
            as: 'timeTrackProject'
          },
          {
            model: Task,
            as: 'timeTrackTask'
          }
        ],
        as: 'userTimeTrack'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.userTimeTrack;
  }

  async getTimeTracksForUser(userId, startDate, endDate) {
    const user = await User.findByPk(userId, {
      include: {
        model: TimeTrack,
        where: {
          start_time: {
            [Sequelize.Op.gte]: startDate
          },
          end_time: {
            [Sequelize.Op.lte]: endDate
          }
        },
        include: [
          {
            model: Client,
            as: 'timeTrackClient'
          },
          {
            model: Project,
            as: 'timeTrackProject'
          },
          {
            model: Task,
            as: 'timeTrackTask'
          }
        ],
        as: 'userTimeTrack'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.userTimeTrack;
  }

  async getAllTimeTracks() {
    return await TimeTrack.findAll({
      include: [
        {
          model: User,
          as: 'timeTrackUser'
        },
        {
          model: Client,
          as: 'timeTrackClient'
        },
        {
          model: Project,
          as: 'timeTrackProject'
        },
        {
          model: Task,
          as: 'timeTrackTask'
        }
      ]
    });
  }

  async getAllTimeTracksForPeriod(startDate, endDate) {
    return await TimeTrack.findAll({
      where: {
        start_time: {
          [Sequelize.Op.gte]: startDate
        },
        end_time: {
          [Sequelize.Op.lte]: endDate
        }
      },
      include: [
        {
          model: User,
          as: 'timeTrackUser'
        },
        {
          model: Client,
          as: 'timeTrackClient'
        },
        {
          model: Project,
          as: 'timeTrackProject'
        },
        {
          model: Task,
          as: 'timeTrackTask'
        }
      ]
    });
  }

  async getTimeTracksInProgress() {
    return await Task.findAndCountAll({
      where: { state: true }
    });
  }

  async getTimeTrackById(id) {
    const timeTrack = await TimeTrack.findByPk(id, {
      include: [
        {
          model: Project
        },
        {
          model: Client
        },
        {
          model: User
        }
      ]
    });
    if (!timeTrack) throw new Error('TimeTrack not found');
    return timeTrack;
  }

  async updateTimeTrack(updates) {
    const {
      id,
      userId,
      taskId,
      clientId,
      projectId,
      start_time,
      end_time,
      estimated_time,
      description
    } = updates;
    const timetrack = await Task.findByPk(id);
    await timetrack.update({
      start_time,
      end_time,
      estimated_time,
      description,
      status: false
    });
    const client = await Client.findByPk(clientId);
    if (!client) throw new Error('Client not found');
    const project = await Project.findByPk(projectId);
    if (!project) throw new Error('Project not found');
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    // await task.setTaskClient(client);
    await timetrack.setTask(task);
    await timetrack.setProject(project);
    await timetrack.setUser(user);
    await timetrack.setClient(client);

    await timetrack.save();
    return { message: 'TimeTrack updated successfully', timetrack };
  }

  async deleteTimeTrack(id) {
    const timetrack = await TimeTrack.findByPk(id);

    if (!timetrack) {
      throw new Error('Task not found.');
    }
    await timetrack.destroy();

    return { message: 'Task and its associations deleted successfully' };
  }
}

module.exports = new TimeTrackService();
