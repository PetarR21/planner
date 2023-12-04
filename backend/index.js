require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const Item = require('./models/item');
const middleware = require('./utils/middleware');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/api/items', async (req, res) => {
  const items = await Item.find({});
  res.json(items);
});

app.get('/api/items/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.sendStatus(404);
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

app.post('/api/items', async (req, res, next) => {
  const { title } = req.body;

  const item = new Item({
    title,
    completed: false,
  });

  try {
    const savedItem = await item.save();
    res.json(savedItem);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/items/:id', async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put('/api/items/:id', async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

app.use(middleware.uknownEndpoint);
app.use(middleware.errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
