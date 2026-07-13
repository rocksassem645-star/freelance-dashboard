require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/infrastructure/database');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => { 
  res.json({ message: "Freelancer Dashboard API is running!" });
});

// Health check route with DB
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

// start server 
app.listen(PORT, () => { 
  console.log(`Server running on http://localhost:${PORT}`);
});