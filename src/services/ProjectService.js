const User = require('../../models/User');
const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Tag = require('../../models/Tag');
const Task = require('../../models/Task');
const { Op } = require('sequelize');

class ProjectService {
  //Create Project
  //Fundatmentally this role is only for admin and project manager.
  //To create Project we need client name, user name
  //Create the association between project and client and user
  async createProject(req) {
    const {
      title,
      clientId,
      package_type,
      monthly_hours,
      rate,
      start_date,
      rollover,
      platforms,
      duration,
      package_level,
      services,
      project_type,
      technology,
      additional_setting,
      portal_access
    } = req.data;

    const client = await Client.findByPk(clientId);
    if (!client) throw new Error('Client not found!');

    const project = await Project.create({
      title,
      package_type,
      monthly_hours,
      rate,
      start_date,
      rollover,
      platforms,
      duration,
      package_level,
      services,
      project_type,
      technology,
      additional_setting,
      portal_access
    });
    console.log(project);
    await client.addRequestedClientProject(project);
    const { users } = req;
    users.map(async (user) => {
      const projectVA = await User.findByPk(user);
      // biome-ignore lint/style/useTemplate: <explanation>
      if (!projectVA) throw new Error('User' + user + 'not found!');
      await projectVA.addAssignedUserProject(project);
    });
    return project;
  }
  //Get all favourite project
  async getAllFavouriteProjectForUser(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Project,
        include: [
          {
            model: User,
            as: 'assignedProjectUser',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Client,
            as: 'requestedProjectClient',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Task,
            as: 'projectTask',
            attributes: ['id', 'title']
          },
          {
            model: Tag,
            as: 'assignedProjectTag',
            attributes: ['id', 'title']
          }
        ],
        as: 'favoriteProject'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.favoriteProject;
  }

  async getAllFavouriteProjectForClient(userId) {
    const user = await User.findByPk(userId, {
      include: {
        model: Project,
        include: [
          {
            model: User,
            as: 'assignedProjectUser',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Client,
            as: 'requestedProjectClient',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Task,
            as: 'projectTask',
            attributes: ['id', 'title']
          },
          {
            model: Tag,
            as: 'assignedProjectTag',
            attributes: ['id', 'title']
          }
        ],
        as: 'favoriteProject'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.favoriteProject;
  }

  //Add Favourite Project
  async addFavouriteProject(userinfo, projectID) {
    const { email } = userinfo;
    const project = await Project.findByPk(projectID);
    const user = await User.findOne({ where: { email } });
    if (user) await user.addFavoriteProject(project);
    const client = await Client.findOne({ where: { email } });
    if (client) await client.addFavoriteProject(project);
    if (!client && !user) throw new Error('User Not Found.');
    return { message: 'Favourite Project Successfully added.' };
  }

  async removeFavouriteProject(userinfo, projectID) {
    const { email } = userinfo;
    const project = await Project.findByPk(projectID);
    if (!project) {
      throw new Error('Project not found.');
    }
    const user = await User.findOne({ where: { email } });
    if (user) await user.removeFavoriteProject(project);
    const client = await Client.findOne({ where: { email } });
    if (client) await user.removeFavoriteProject(project);
    if (!client && !user) throw new Error('User Not Found.');
    return { message: 'Project Favour Successfully removed.' };
  }

  //Get all projects with associated users and clients.
  async getAllProjectsForClient(userId) {
    const user = await Client.findByPk(userId, {
      include: {
        model: Project,
        include: [
          {
            model: User,
            as: 'assignedProjectUser',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Client,
            as: 'requestedProjectClient',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Task,
            as: 'projectTask',
            attributes: ['id', 'title']
          },
          {
            model: Tag,
            as: 'assignedProjectTag',
            attributes: ['id', 'title']
          }
        ],
        as: 'requestedClientProject'
      }
    });
    if (!user) throw new Error('User not found!');
    return user.requestedClientProject;
  }

  //Get all projects with associated users and clients.
  async getAllProjectsForUser(userId) {
    // console.log(userId);
    const user = await User.findByPk(userId, {
      include: {
        model: Project,
        include: [
          {
            model: User,
            as: 'assignedProjectUser',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Client,
            as: 'requestedProjectClient',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Task,
            as: 'projectTask',
            attributes: ['id', 'title']
          }
        ],
        as: 'assignedUserProject'
      }
    });
    if (!user) throw new Error('User not found!');
    console.log(user);
    return user.assignedUserProject;
  }

  async getAllProjectByUserEmail(email) {
    const user = await User.findOne({ where: { email: email } });
    if (user) return await this.getAllProjectsForUser(user.id);
    const client = await Client.findOne({ where: { email: email } });
    if (client) return await this.getAllProjectsForClient(client.id);
    if (!user && !client) throw new Error('User not Found!');
  }

  //Get all projects.
  async getAllProjects() {
    const project = Project.findAll({
      include: [
        {
          model: User,
          as: 'assignedProjectUser',
          attributes: ['id', 'full_name', 'email', 'position'],
          through: {
            attributes: []
          }
        },
        {
          model: Client,
          as: 'requestedProjectClient',
          attributes: ['id', 'full_name', 'email'],
          through: {
            attributes: []
          }
        },
        {
          model: Task,
          as: 'projectTask',
          attributes: ['id', 'title', 'time_spent']
        }
        // {
        //   model: Tag,
        //   as: 'assignedProjectTag',
        //   attributes: ['id', 'title']
        //   // through: {
        //   //   attributes: [],
        //   // },
        // }
      ]
    });
    if (!project) throw new Error('Project not found!');
    return project;
  }

  async activeProjects() {
    const projects = await Project.findAndCountAll({
      where: {
        state: { [Op.ne]: 'completed' }
      }
    });

    if (!projects || projects.length === 0)
      throw new Error('No active projects found!');

    return projects;
  }

  async getProjectById(id) {
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedProjectUser',
          attributes: ['id', 'full_name', 'email'],
          through: {
            attributes: []
          }
        },
        {
          model: Client,
          as: 'requestedProjectClient',
          attributes: ['id', 'full_name', 'email'],
          through: {
            attributes: []
          }
        },
        {
          model: Task,
          as: 'projectTask',
          attributes: ['id', 'title']
        }
        // {
        //   model: Tag,
        //   as: 'assignedProjectTag',
        //   attributes: ['id', 'title']
        // }
      ]
    });
    if (!project) throw new Error('Project not found');
    return project;
  }

  async updateProject(id, updates) {
    const { client, users, tags } = updates;
    const project = await Project.findByPk(id);
    await project.update(updates);
    if (client) {
      const upclient = await Client.findOne({ where: { full_name: client } });
      if (!upclient) {
        throw new Error('Client not found.');
      }
      // Update the association with Client
      await project.setRequestedProjectClient([upclient]);
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
        await Project.setAssignedProjectTag(tags);
      }

      // Update the association with Users
      await project.setAssignedProjectUser(upusers);
    }
    await project.save();
    return { message: 'Project updated successfully' };
  }

  async deleteProject(id) {
    const project = await Project.findByPk(id);

    if (!project) {
      throw new Error('Project not found.');
    }

    await project.destroy();

    return { message: 'Project and its associations deleted successfully' };
  }

  async getProjectByTag(tagId) {
    const tag = await Tag.findByPk(tagId, {
      include: {
        model: Project,
        include: [
          {
            model: User,
            as: 'assignedProjectUser',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Client,
            as: 'requestedProjectClient',
            attributes: ['id', 'full_name'],
            through: {
              attributes: []
            }
          },
          {
            model: Task,
            as: 'projectTask',
            attributes: ['id', 'title'],
            through: {
              attributes: []
            }
          },
          {
            model: Tag,
            as: 'assignedProjectTag',
            attributes: ['id', 'title'],
            through: {
              attributes: []
            }
          }
        ],
        as: 'assignedTagProject'
      }
    });
    if (!tag) throw new Error('Tag not found!');
    return tag.setAssignedTagProject;
  }
}

module.exports = new ProjectService();
