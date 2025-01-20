const User = require('../../models/User');
const Client = require('../../models/Client');
const ModelRole = require('../../models/ModelRole');
const Roles = require('../../models/Roles');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const handleRef = async (req, res, next) => {
  try {
    const refresh_token = req.body.refresh_token;
    if (!refresh_token) return res.sendStatus(401);
    let model_type = 'user';
    let confirmToken = await User.findOne({
      where: { ref_token: refresh_token }
    });
    if (!confirmToken) {
      model_type = 'client';
      confirmToken = await Client.findOne({
        where: { ref_token: refresh_token }
      });
    }

    console.log(confirmToken);
    if (!confirmToken) {
      reusedRef = jwt.verify(
        refresh_token,
        process.env.JWT_REF_TOKEN,
        async (error, decoded) => {
          if (error) return res.sendStatus(403);
        }
      );
      return res.status(401);
    }
    const email = confirmToken.email;
    const ref = confirmToken.id;
    verifyRef = jwt.verify(
      refresh_token,
      process.env.JWT_REF_TOKEN,
      async (error, decoded) => {
        //Find user role
        //get role id and name from the modeltype and modelid.
        const modelRole = await ModelRole.findOne({
          where: {
            model_type: model_type,
            model_id: confirmToken.id
          }
        });
        const role_id = modelRole.role_id;
        const roleen = await Roles.findByPk(role_id);
        const role = roleen.name;
        if (!role_id)
          return res.status(404).json({ message: 'No Record Found!' });
        const access_token = jwt.sign(
          {
            id: confirmToken.id,
            email: confirmToken.email,
            role_id: role_id,
            role: role
          },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: '600s' }
        );
        const refresh_token = jwt.sign(
          {
            id: confirmToken.id,
            email: confirmToken.email,
            role_id: role_id,
            role: role
          },
          process.env.JWT_REFRESH_TOKEN,
          { expiresIn: '48h' }
        );
        confirmToken.ref_token = refresh_token;
        const saveRef = await confirmToken.save();
        return res.status(200).json({ access_token, refresh_token });
      }
    );
  } catch (err) {
    // statements
    throw err;
  }
};

module.exports = {
  handleRef
};
