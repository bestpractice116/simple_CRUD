// Check if the user has the defined role.

const jwt = require('jsonwebtoken');

/**
 * Extracts the authenticated user from the JWT token in the request headers.
 * @param {Object} req - The HTTP request object.
 * @returns {Object|null} - The decoded user object or null if the token is invalid.
 */
function getAuthenticatedUser(req) {
  const reqtoken = req.headers.authorization;
  const token = reqtoken.split(' ')[1]; // Get token from 'Authorization' header

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = {
      id: decoded.id,
      email: decoded.email,
      role_id: decoded.role_id,
      role: decoded.role
    };
    return user; // Assuming the JWT contains user data
  } catch (err) {
    return null;
  }
}

module.exports = {
  getAuthenticatedUser
};
