const jwt = require('jsonwebtoken');
const { secretKey } = require('./config');
const authenticateJWT = (req, res, next) => {
  res.removeHeader('Content-Type-Policy');
  const token = req.header('Authorization');
  const utility = require('../utility/utility');

  if (!token) {
    return res.status(401).json(utility.DataEncrypt(JSON.stringify({ message: 'Missing authorization token' })));
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');
  jwt.verify(tokenWithoutBearer, 'secretkey', { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).json(utility.DataEncrypt(JSON.stringify({ err: err, message: 'Invalid token', token: err })));
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;

