const jwt = require('jsonwebtoken');

const getLoggedToken = (_id) => {
  return jwt.sign(
    { _id },
    process.env.JSON_TOKEN_SECRET,
    { expiresIn: '24h' },
    )
};

const getRegistrationToken = (_id) => {
  return jwt.sign(
    { _id },
    process.env.JSON_TOKEN_SECRET,
    { expiresIn: '1h' },
    )
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JSON_TOKEN_SECRET);
};

module.exports = {
  getLoggedToken,
  getRegistrationToken,
  verifyToken,
}