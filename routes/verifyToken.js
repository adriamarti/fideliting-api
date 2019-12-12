const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).send({
      message: `Access denied`,
    });
  };

  try {
    const verified = jwt.verify(token, process.env.JSON_TOKEN_SECRET);
    req.user = verified;
    return next();
  } catch(err) {
    return res.status(400).send({
      message: `Invalid Token`,
    });
  }
}