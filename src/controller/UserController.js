const authUserService = require('../services/authUserService');
const jwt = require('jsonwebtoken');
const roleService = require('../services/roleService');
const ModelRole = require('../../models/ModelRole');

class UserController {
  async signup(req, res) {
    try {
      // console.log(req.body);
      const user = await authUserService.createUser(req);
      //set Role to the User
      const role = req.body.role;
      console.log(req.body.role);
      const role_id = await roleService.getRoleIdByName(role);
      const model_id = user.id;
      const model_type = 'user';
      await ModelRole.create({ model_id, model_type, role_id });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await authUserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await authUserService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const data = req.body;
      if (req.file) {
        data.photo = req.file.path;
      }
      const updatedUser = await authUserService.updateUser(req.params.id, data);
      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await authUserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
