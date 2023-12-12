const router = require('express').Router();
const Item = require('../models/item');
const { tokenExtractor, userExtractor } = require('../utils/middleware');

router.get('/', tokenExtractor, userExtractor, async (req, res) => {
  const items = await Item.find({}).populate('user', { username: 1, name: 1 });
  const user = req.user;
  console.log(user);

  res.json(items.filter((item) => item.user.id === user.id));
});

router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.sendStatus(404);
  }
  res.json(item);
});

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const { title } = req.body;
  const user = req.user;

  const item = new Item({
    title,
    completed: false,
    user: user._id,
  });

  const savedItem = await item.save();
  user.items = user.items.concat(savedItem._id);
  await user.save();
  res.json(await savedItem.populate('user', { username: 1, name: 1 }));
});

router.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  const user = req.user;
  if (user._id.toString() !== item.user.toString()) {
    return res.status(401).json({ error: 'only the creator can delete items' });
  }

  if (!item) {
    return res.sendStatus(404);
  }
  res.sendStatus(204);
});

router.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.sendStatus(404);
  }

  const user = req.user;
  if (user._id.toString() !== item.user.toString()) {
    return res.status(401).json({ error: 'only the creator can update items' });
  }

  const updatedItem = await Item.findByIdAndUpdate(item.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  res.json(updatedItem);
});

module.exports = router;
