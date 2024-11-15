const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const userRoutes = require('./routes/users');
const surveyRoutes = require('./routes/surveys');
const questionRoutes = require('./routes/questions');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://surveyappl.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/questions', questionRoutes);

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log('Registered routes:');
  console.log('/api/users');
  console.log('/api/surveys');
  console.log('/api/questions');
});
