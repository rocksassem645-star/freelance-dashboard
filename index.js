require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/infrastructure/database');
const clientRoutes = require('./src/routes/clientRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
pool.getConnection().then((connection) => {
  console.log('✅ MySQL Connected Successfully!');
  connection.release();
}).catch((err) => {
  console.error('❌ MySQL Connection Error:', err.message);
});

// Routes
app.get('/', (req, res) => { 
  res.json({ message: "Freelancer Dashboard API is running!" });
});

// Client routes
app.use('/api/clients', clientRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: "healthy", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "unhealthy", error: err.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => { 
  console.log(`Server running on http://localhost:${PORT}`);
});