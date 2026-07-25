const express = require('express');
const router = express.Router();
const {
  getWeather,
  chatbot,
  getSchemes,
  getCalendar,
  getMandiPrices,
  getSoilInfo
} = require('../controllers/assistantController');

// GET  /api/assistant/weather   — Fetch weather and farming advice
router.get('/weather', getWeather);

// POST /api/assistant/chatbot   — Query Mistral AI farming chatbot
router.post('/chatbot', chatbot);

// GET  /api/assistant/schemes   — Fetch government schemes (by state)
router.get('/schemes', getSchemes);

// GET  /api/assistant/calendar  — Fetch crop calendar (by state)
router.get('/calendar', getCalendar);

// GET  /api/assistant/mandi     — Fetch crop market prices (by state)
router.get('/mandi', getMandiPrices);

// GET  /api/assistant/soil      — Fetch soil info
router.get('/soil', getSoilInfo);

module.exports = router;
