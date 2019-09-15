const jwt = require('jsonwebtoken');
// const config = require('config');
require('dotenv').config();

module.exports = function(req, res, next) {
  // Get token from header
  // header comes from req - x-auth-token is within the headers
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Decodes the header token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Payload has userID
    // payload = { user: { id: user.id }}
    req.user = decoded.user;
    next();
  } catch(err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}