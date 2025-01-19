const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const User = require('../../models/User');
const Client = require('../../models/Client');

const handleSignout = async (req, res, next) => {
  try {
    let confrimToken = await User.findOne({
      where: { ref_token: req.body.refresh_token }
    });
    if (!confrimToken) {
      confrimToken = await Client.findOne({
        where: { ref_token: req.body.refresh_token }
      });
    }
    if (!confrimToken) {
      return res.sendStatus(204);
    }
    confrimToken.ref_token = '';
    const result = await confrimToken.save();
    return res.sendStatus(204);
  } catch (err) {
    // statements
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = handleSignout;
