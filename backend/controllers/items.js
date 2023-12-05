const router = require('express').Router();
const Item = require('../models/item');

router.get('/', async (req, res) => {
  const items = await Item.find({});
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.sendStatus(404);
  }
  res.json(item);
});

router.post('/', async (req, res) => {
  const { title } = req.body;

  const item = new Item({
    title,
    completed: false,
  });

  const savedItem = await item.save();
  res.json(savedItem);
});

router.delete('/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.sendStatus(404);
  }
  res.sendStatus(204);
});

router.put('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.sendStatus(404);
  }
  const updatedItem = await Item.findByIdAndUpdate(item.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  res.json(updatedItem);
});

module.exports = router;
