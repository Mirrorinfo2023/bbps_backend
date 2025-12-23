const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate a dynamic secret key from client_id
 */
function getClientSecretKey(client_id) {
  const secret = crypto.createHash('sha256').update(String(client_id)).digest('hex');
  console.log('Generated secret for client_id', client_id, ':', secret); // 🔹 log secret
  return secret;
}

const authenticateJWT = (req, res, next) => {
  res.removeHeader('Content-Type-Policy');

  let token = req.header('Authorization');
  if (!token) {
    console.error('❌ Missing authorization token');
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  console.log('Incoming Authorization header:', token);

  // Remove Bearer prefix
  token = token.replace(/^Bearer\s+/i, '').trim();
  console.log('Token after removing Bearer:', token);

  // Decode token without verifying
  const decoded = jwt.decode(token);
  console.log('Decoded token payload:', decoded);

  if (!decoded || !decoded.client_id) {
    console.error('❌ Invalid token payload or missing client_id');
    return res.status(400).json({ message: 'Invalid token payload (missing client_id)' });
  }

  const dynamicSecret = getClientSecretKey(decoded.client_id);

  // Verify JWT
  try {
    const verified = jwt.verify(token, dynamicSecret, { algorithms: ['HS256'] });
    console.log('✅ JWT verified successfully. Payload:', verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = authenticateJWT;
