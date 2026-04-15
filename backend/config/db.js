const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/plant-disease-db';
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Running without database — prediction history will not be saved.');
    // Don't exit; allow app to run without MongoDB
  }
};

module.exports = connectDB;
