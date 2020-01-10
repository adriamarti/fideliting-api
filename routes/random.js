const router = require('express').Router();

const { verifyLoginToken } = require('../middlewares/verifyToken');

// RANDOM
router.get('/', verifyLoginToken, async (req, res) => {
  res.json(req.user);
})

module.exports = router;