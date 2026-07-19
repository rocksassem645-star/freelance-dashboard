// server/src/infrastructure/middleware/authMiddleware.js
const { verify } = require("jsonwebtoken");
const authUseCase = require("../../application/usecases/AuthUseCase");

// middleware to verify jwt tokens
const authMiddleware = (req, res, next) => {
  try {
    // get token from authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token: format should be "Bearer <token>"
    // Check for "Bearer " with capital B and space
    let token;
    if (authHeader.startsWith('Bearer ')) {  // ← FIXED: capital B, includes space
      token = authHeader.slice(7);           // Remove "Bearer "
    } else {
      // If no "Bearer " prefix, assume the whole header is the token
      token = authHeader;
    }

    console.log('🔑 Token received:', token.substring(0, 20) + '...');

    // verify token using authUseCase
    const decoded = authUseCase.verifyToken(token);

    console.log('✅ Token verified for user:', decoded.id);

    // attach user info to request
    req.user = decoded;
    next();

  } catch (err) {
    console.error('❌ Auth error:', err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;