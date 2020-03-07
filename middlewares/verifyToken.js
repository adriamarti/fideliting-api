const { verifyToken } = require('../services/token');

const tokenHasExpired = (expiration) => {
  return Date.now() >= expiration * 1000
}

const verifyRegisterToken = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).send({
      message: `Access denied`,
    });
  };

  try {
    req.user = verifyToken(token);
    
    if (tokenHasExpired(req.user.exp)) {
      return res.status(400).send({
        message: `Token has expired`,
      });
    }

    return next();
  } catch(err) {
    return res.status(400).send({
      message: `Invalid Token`,
    });
  }
}

const verifyLoginToken = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).send({
      message: `Access denied`,
    });
  };

  try {
    req.user = verifyToken(token);
    
    if (tokenHasExpired(req.user.exp)) {
      return res.status(400).send({
        message: `Token has expired`,
      });
    }

    return next();
  } catch(err) {
    return res.status(400).send({
      message: `Invalid Token`,
    });
  }
}

module.exports = {
  verifyRegisterToken,
  verifyLoginToken,
}