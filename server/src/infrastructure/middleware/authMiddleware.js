const { verify } = require("jsonwebtoken");
const authUseCase = require("../../application/usecases/AuthUseCase");
const logger = require("../logger");  // Use proper logging

// Middleware to verify JWT tokens
const authMiddleware = (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token: format should be "Bearer <token>"
    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Check if token is blacklisted (revoked)
    if (authUseCase.isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Verify token
    const decoded = authUseCase.verifyToken(token);

    // Attach user info to request
    req.user = decoded;
    next();

  } catch (err) {
    logger.warn('Token verification failed:', { 
      error: err.message,
      ip: req.ip 
    });
    
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;