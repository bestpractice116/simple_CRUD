const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

class AuthUserService {
  async createUser(req) {
    const {
      first_name,
      last_name,
      email,
      sex,
      password,
      phone,
      address,
      position,
      city,
      state,
      country,
      zip_code,
      dob,
      role
    } = req.body;
    // biome-ignore lint/style/useTemplate: <explanation>
    const full_name = first_name + ' ' + last_name;
    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const avatar = 'uploads/no-image.jpg';
    // Create and return the new user
    return await User.create({
      first_name,
      last_name,
      full_name,
      email,
      sex,
      password,
      phone,
      address,
      position,
      city,
      state,
      country,
      zip_code,
      avatar,
      dob,
      role,
      status: 1
    });
  }

  async findUserByEmail(data) {
    const { email } = data;
    return await User.findOne({ where: { email } }, {
      include: [{
        model: Project,
        as: 'assignedUserProject'
      }, {
        model: Task,
        as: 'assignedUserTask'
      }]
    });
  }

  async getAllUsers() {
    return await User.findAll({
      include: [{
        model: Project,
        as: 'assignedUserProject',
        attributes: ['id', 'title']
      }, {
        model: Task,
        as: 'assignedUserTask',
        attributes: ['id', 'title', 'state']
      }]
    });
  }

  // Get a User by ID
  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [{
        model: Project,
        as: 'assignedUserProject',
        attributes: ['id', 'title']
      }, {
        model: Task,
        as: 'assignedUserTask',
        attributes: ['id', 'title']
      }]
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id, updates) {
    const user = await this.getUserById(id);
    return await user.update(updates);
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (user.photo) {
      try {
        fs.unlinkSync(path.resolve(user.photo));
      } catch (error) {
        console.error('Error deleting avatar file:', error);
      }
    }
    return await user.destroy();
  }
}

module.exports = new AuthUserService();