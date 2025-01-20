const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const handleVerify = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  const auth_verify = token.split(' ')[1];
  const verifyToken = jwt.verify(auth_verify, process.env.JWT_ACCESS_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Token Invalid!' });
    }
    req.isAuth = { decoded };
    req.role = decoded.role;
    next();
  });
};

module.exports = {
  handleVerify
};