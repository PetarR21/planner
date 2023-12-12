const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find({}).populate('items', { title: 1, completed: 1 });
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = router;
