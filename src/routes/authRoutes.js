const express = require("express");
const rateLimit = require("express-rate-limit");
const Joi = require("joi");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const authUseCase = require("../application/usecases/AuthUseCase");
const authMiddleware = require("../infrastructure/middleware/authMiddleware");

const router = express.Router();

// Middleware
router.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Rate limiters
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 100,                     //  registrations per hour per IP
  message: "Too many accounts created, try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',  // Skip in tests
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 5,                      // 5 attempts per 15 min
  message: "Too many login attempts, try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,  // Don't count successful attempts
  skip: (req) => process.env.NODE_ENV === 'test',
});

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(12).required(),
  country: Joi.string().length(2).uppercase().required(),  // ISO 3166-1 alpha-2
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
}).unknown(false);

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown(false);

// Validation middleware
const validateSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ errors: messages });
  }

  req.validatedBody = value;
  next();
};

// GET CSRF token
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Register endpoint
router.post(
  "/register",
  registerLimiter,
  validateSchema(registerSchema),
  async (req, res) => {
    try {
      const { name, email, password, country } = req.validatedBody;
      
      const result = await authUseCase.register(name, email, password, country);

      res.status(201).json({
        message: "Registration successful",
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (err) {
      // Don't expose internal error details
      const message = err.message.includes("already registered") 
        ? "If email already registered, check your inbox"
        : "Registration failed";
      
      res.status(400).json({ error: message });
    }
  }
);

// Login endpoint
router.post(
  "/login",
  loginLimiter,
  csrfProtection,
  validateSchema(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.validatedBody;
      const result = await authUseCase.login(email, password);

      res.status(200).json({
        message: "Login successful",
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
);

// Refresh token endpoint
router.post(
  "/refresh",
  validateSchema(refreshSchema),
  async (req, res) => {
    try {
      const { refreshToken } = req.validatedBody;
      const decoded = authUseCase.verifyRefreshToken(refreshToken);
      
      const userRepository = require("../infrastructure/repositories/UserRepository");
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const tokens = authUseCase.generateTokenPair(user.id, user.email);
      
      res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (err) {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  }
);

// Get current user endpoint
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userRepository = require("../infrastructure/repositories/UserRepository");
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ 
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint (add token to blacklist)
router.post("/logout", authMiddleware, (req, res) => {
  try {
    const token = req.headers['authorization'].slice(7);
    authUseCase.revokeToken(token);
    
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;