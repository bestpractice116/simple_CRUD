const authUserService = require('../services/authUserService');
const authClientService = require('../services/authClientService');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const roleService = require('../services/roleService');
const ModelRole = require('../../models/ModelRole');
const Roles = require('../../models/Roles');

class LoginController {
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required.' });
    }
    try {
      //Search user in both user model and client model.
      let model_type;
      let user = await authUserService.findUserByEmail(req.body);
      model_type = 'user';
      if (!user) {
        user = await authClientService.findClientByEmail(req.body);
        model_type = 'client';
      }

      // If neither User nor Client exists, return error
      if (!user) {
        return res.status(404).json({ error: true, message: 'Account not found!' });
      }
      //Password Check
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password!' });
      }
      //get role id and name from the modeltype and modelid.
      const modelRole = await ModelRole.findOne({
        where: {
          model_type: model_type,
          model_id: user.id
        }
      });
      const role_id = modelRole.role_id;
      const roleen = await Roles.findByPk(role_id);
      const role = roleen.name;
      const username = user.full_name;
      const userId = user.id;
      const access_token = jwt.sign({ id: user.id, email: user.email, role_id: role_id, role: role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '6000s' });
      const refresh_token = jwt.sign({ id: user.id, email: user.email, role_id: role_id, role: role }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '48h' });
      res.cookie('auth_token', refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 48 * 60 * 60 * 1000
      });

      if (model_type === 'user') {
        await authUserService.updateUser(user.id, { ref_token: refresh_token });
      } else {
        await authClientService.updateClient(user.id, {
          ref_token: refresh_token
        });
      }

      return res.status(200).json({
        error: false,
        message: 'Logged in successfully.',
        access_token,
        refresh_token,
        role,
        username,
        userId
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new LoginController();