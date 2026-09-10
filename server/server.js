require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerLens AI Backend API',
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Optional MongoDB Connection with Graceful Fallback
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => {
      console.warn('MongoDB connection failed. Continuing gracefully with in-memory storage.', err.message);
    });
} else {
  console.log('No MONGODB_URI provided. Running in high-performance in-memory session mode.');
}

app.listen(PORT, () => {
  console.log(`CareerLens AI Backend running on port ${PORT}`);
});
