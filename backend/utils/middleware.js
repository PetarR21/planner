const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:', request.path);
  logger.info('Body:', request.body);
  logger.info('---');

  next();
};

const uknownEndpoint = (req, res) => {
  return res.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    return res.status(401).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: 'token invalid' });
  }
  req.user = user;
  next();
};

module.exports = {
  uknownEndpoint,
  errorHandler,
  requestLogger,
  tokenExtractor,
  userExtractor,
};
