require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

// ==================
// Connect Database
// ==================
connectDB();

// ==================
// Middleware
// ==================
app.use(cors());
app.use(express.json());

// ==================
// Routes
// ==================

// Root route (for browser check)
app.get('/', (req, res) => {
    res.send('Lost & Found API is running 🚀');
});

// Auth routes
app.use('/api', authRoutes);

// Item routes
app.use('/api/items', itemRoutes);

// ==================
// Server
// ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});