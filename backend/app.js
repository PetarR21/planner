const cors = require('cors');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const app = express();
const config = require('./utils/config');
const itemsRouter = require('./controllers/items');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(middleware.requestLogger);

app.use('/api/items', itemsRouter);

app.use(middleware.uknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
