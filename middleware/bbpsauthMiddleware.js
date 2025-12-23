const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const utility = require('../utility/utility');

/**
 * Generate a dynamic secret key from client_id
 */
function getClientSecretKey(client_id) {
  // Create a 256-bit (32-byte) hash key from client_id
  return crypto.createHash('sha256').update(client_id).digest('hex');
}

const authenticateJWT = (req, res, next) => {
  res.removeHeader('Content-Type-Policy');
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json(JSON.stringify({ message: 'Missing authorization token' }));
  }

  const tokenWithoutBearer = token.replace('Bearer ', '').trim();

  // Step 1️⃣: Decode token (without verifying) to extract client_id
  const decoded = jwt.decode(tokenWithoutBearer);
  if (!decoded || !decoded.client_id) {
    return res
      .status(400)
      .json(JSON.stringify({ message: 'Invalid token payload (missing client_id)' }));
  }

  // Step 2️⃣: Generate dynamic secret key using client_id
  const dynamicSecret = getClientSecretKey(decoded.client_id);

  // Step 3️⃣: Verify token using the dynamic secret
  jwt.verify(tokenWithoutBearer, dynamicSecret, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res
        .status(403)
        .json(JSON.stringify({ message: 'Invalid token', error: err.message }));
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
