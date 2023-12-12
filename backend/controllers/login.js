const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userForToken = {
    username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  return res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
