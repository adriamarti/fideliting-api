const router = require('express').Router();
const verifyToken = require('./verifyToken')

// RANDOM
router.get('/', verifyToken, async (req, res) => {
  res.json(req.user);
})

module.exports = router;