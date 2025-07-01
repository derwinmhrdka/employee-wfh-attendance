require('dotenv').config();
const express = require('express');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
