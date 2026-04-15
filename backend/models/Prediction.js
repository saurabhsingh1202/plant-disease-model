const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  imagePath: { type: String },
  plant: { type: String, required: true },
  disease: { type: String, required: true },
  className: { type: String, required: true },
  confidence: { type: Number, required: true },
  severity: { type: String, enum: ['none', 'medium', 'high', 'critical', 'unknown'], default: 'unknown' },
  isHealthy: { type: Boolean, default: false },
  description: { type: String },
  treatment: { type: String },
  topPredictions: [{ class: String, confidence: Number }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);
