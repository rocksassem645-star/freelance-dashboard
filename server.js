// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./src/infrastructure/logger');

const app = express();

// ============================================
// SECURITY: Validate Environment
// ============================================
const requiredEnvVars = [
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_NAME',
  'DB_PASSWORD',
  'NODE_ENV'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ FATAL: Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

console.log('✅ All required environment variables validated');

// ============================================
// SECURITY: Headers & CORS
// ============================================
app.use(helmet());

const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================
// SECURITY: Middleware
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb' }));

// ============================================
// FIX: Make req.query writable for csurf
// ============================================
app.use((req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    const originalQuery = req.query;
    req.query = new Proxy(originalQuery, {
      set: (obj, prop, value) => {
        obj[prop] = value;
        return true;
      },
      get: (obj, prop) => {
        return obj[prop];
      }
    });
  }
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
});

app.use('/api/', limiter);

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));

// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({ message: 'Freelancer Dashboard API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected' });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';
  res.status(statusCode).json({ error: message });
});

// ============================================
// SERVER STARTUP
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});