const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const predictionRoutes = require('./routes/predictionRoutes');

dotenv.config();

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/predictions', predictionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Plant Disease Detection API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`   MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Using local default'}`);
  console.log(`   ML Service: ${process.env.ML_SERVICE_URL || 'http://localhost:5001'}\n`);
});
