// // server.js
// require("dotenv").config();
// const express = require("express");
// const helmet = require("helmet");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// const logger = require("./src/infrastructure/logger");

// const app = express();

// // ============================================
// // SECURITY: Validate Environment
// // ============================================
// const requiredEnvVars = [
//   "JWT_SECRET",
//   "REFRESH_TOKEN_SECRET",
//   "DB_HOST",
//   "DB_USER",
//   "DB_NAME",
//   "DB_PASSWORD",
//   "NODE_ENV",
// ];
// // To this (ALLOW empty password):
// for (const envVar of requiredEnvVars) {
//   // Skip DB_PASSWORD check - it can be empty
//   if (envVar === "DB_PASSWORD") continue;

//   if (!process.env[envVar]) {
//     console.error(`❌ FATAL: Missing environment variable: ${envVar}`);
//     process.exit(1);
//   }
// }

// console.log("✅ All required environment variables validated");

// // ============================================
// // SECURITY: Headers & CORS
// // ============================================
// app.use(helmet());

// const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [
//   "http://localhost:3000",
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// // ============================================
// // SECURITY: Middleware
// // ============================================
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ limit: "10kb" }));

// // ============================================
// // FIX: Make req.query writable for csurf
// // ============================================
// app.use((req, res, next) => {
//   if (req.query && typeof req.query === "object") {
//     const originalQuery = req.query;
//     req.query = new Proxy(originalQuery, {
//       set: (obj, prop, value) => {
//         obj[prop] = value;
//         return true;
//       },
//       get: (obj, prop) => {
//         return obj[prop];
//       },
//     });
//   }
//   next();
// });

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later",
// });

// app.use("/api/", limiter);

// // ============================================
// // ROUTES
// // ============================================
// app.use("/api/auth", require("./src/routes/authRoutes"));
// app.use("/api/clients", require("./src/routes/clientRoutes"));

// // ============================================
// // HEALTH CHECK
// // ============================================
// app.get("/", (req, res) => {
//   res.json({ message: "Freelancer Dashboard API is running!" });
// });

// app.get("/api/health", (req, res) => {
//   res.json({ status: "healthy", database: "connected" });
// });

// // ============================================
// // ERROR HANDLING
// // ============================================
// app.use((err, req, res, next) => {
//   logger.error(`Unhandled error: ${err.message}`);
//   const statusCode = err.statusCode || 500;
//   const message =
//     process.env.NODE_ENV === "development"
//       ? err.message
//       : "Internal server error";
//   res.status(statusCode).json({ success: false, error: message });
// });

// // ============================================
// // SERVER STARTUP
// // ============================================
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(
//     `✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
//   );
// });
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const logger = require("./src/infrastructure/logger");
const database = require("./src/infrastructure/database");

const app = express();


// ======================================================
// Validate Environment Variables
// ======================================================

const requiredEnvVars = [
  "JWT_SECRET",
  "REFRESH_TOKEN_SECRET",
  "DB_HOST",
  "DB_USER",
  "DB_NAME",
  "NODE_ENV",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

console.log("✅ Environment variables validated.");


// ======================================================
// Security Middleware
// ======================================================

app.use(helmet());

app.disable("x-powered-by");


// ======================================================
// Compression
// ======================================================

app.use(compression());


// ======================================================
// CORS
// ======================================================

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ======================================================
// Body Parser
// ======================================================

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "10kb",
}));


// ======================================================
// Rate Limiter
// ======================================================

const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: process.env.NODE_ENV === "production"
    ? 100
    : 1000,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);


// ======================================================
// Logger
// ======================================================

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});


// ======================================================
// Routes
// ======================================================

app.use("/api/auth", require("./src/routes/authRoutes"));

app.use("/api/clients", require("./src/routes/clientRoutes"));

app.use("/api/projects", require("./src/routes/projectRoutes"));

app.use("/api/invoices", require("./src/routes/invoiceRoutes"));


// ======================================================
// Health Check
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Freelancer Dashboard API Running",
  });
});


app.get("/api/health", async (req, res) => {

  try {

    await database.query("SELECT 1");

    res.json({
      success: true,
      status: "healthy",
      database: "connected",
      environment: process.env.NODE_ENV,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      status: "unhealthy",
      database: "disconnected",
    });

  }

});


// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    error: "Route not found",

  });

});


// ======================================================
// Global Error Handler
// ======================================================

app.use((err, req, res, next) => {

  logger.error(err.stack);

  res.status(err.statusCode || 500).json({

    success: false,

    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",

  });

});


// ======================================================
// Start Server
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`
===========================================
🚀 Freelancer Dashboard API
===========================================
Environment : ${process.env.NODE_ENV}
Port        : ${PORT}
===========================================
`);

});