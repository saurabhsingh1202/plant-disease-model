const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const Prediction = require('../models/Prediction');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// ── POST /api/predictions/predict ────────────────────────────────────────────
exports.predict = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // Forward image to Python ML service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    const { prediction } = mlResponse.data;

    // Try to save to MongoDB (non-blocking — don't fail if DB is down)
    let savedPrediction = null;
    try {
      savedPrediction = await Prediction.create({
        imageName: req.file.originalname,
        imagePath: `/uploads/${req.file.filename}`,
        plant: prediction.plant,
        disease: prediction.disease,
        className: prediction.class,
        confidence: prediction.confidence,
        severity: prediction.severity,
        isHealthy: prediction.is_healthy,
        description: prediction.description,
        treatment: prediction.treatment,
        topPredictions: prediction.top_predictions
      });
    } catch (dbError) {
      console.warn('⚠️  Could not save prediction to MongoDB:', dbError.message);
    }

    return res.json({
      success: true,
      prediction,
      id: savedPrediction?._id || null
    });

  } catch (error) {
    // Clean up uploaded file on error
    fs.unlink(filePath, () => {});

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: 'ML service is not running. Please start the Python Flask service (ml_service/app.py) on port 5001.',
        details: 'Run: cd ml_service && python app.py'
      });
    }

    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Prediction failed';
    return res.status(status).json({ error: message });
  }
};

// ── GET /api/predictions/history ──────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Prediction.countDocuments()
    ]);

    res.json({
      success: true,
      predictions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history: ' + error.message });
  }
};

// ── GET /api/predictions/stats ─────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [total, healthy, diseased, bySeverity] = await Promise.all([
      Prediction.countDocuments(),
      Prediction.countDocuments({ isHealthy: true }),
      Prediction.countDocuments({ isHealthy: false }),
      Prediction.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }])
    ]);

    res.json({
      success: true,
      stats: { total, healthy, diseased, bySeverity }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats: ' + error.message });
  }
};

// ── DELETE /api/predictions/:id ────────────────────────────────────────────
exports.deletePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndDelete(req.params.id);
    if (!prediction) return res.status(404).json({ error: 'Prediction not found' });

    // Delete uploaded file
    const filePath = path.join(__dirname, '..', prediction.imagePath);
    fs.unlink(filePath, () => {});

    res.json({ success: true, message: 'Prediction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prediction: ' + error.message });
  }
};
