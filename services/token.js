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

const getStellarAccountToken = (publicKey, privateKey) => {
  return jwt.sign(
    { publicKey, privateKey },
    process.env.JSON_TOKEN_SECRET,
    )
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JSON_TOKEN_SECRET);
};

module.exports = {
  getLoggedToken,
  getRegistrationToken,
  getStellarAccountToken,
  verifyToken,
}