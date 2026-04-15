const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  predict,
  getHistory,
  getStats,
  deletePrediction
} = require('../controllers/predictionController');

// POST   /api/predictions/predict    — Upload image and get prediction
router.post('/predict', upload.single('image'), predict);

// GET    /api/predictions/history    — Get prediction history
router.get('/history', getHistory);

// GET    /api/predictions/stats      — Get aggregate stats
router.get('/stats', getStats);

// DELETE /api/predictions/:id        — Delete a prediction
router.delete('/:id', deletePrediction);

module.exports = router;
