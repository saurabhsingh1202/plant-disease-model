const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Helper to load JSON files safely
async function loadJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return null;
  }
}

// ── GET /api/assistant/weather ────────────────────────────────────────────────
exports.getWeather = async (req, res) => {
  const city = req.query.city || 'Varanasi';

  try {
    // 1. Geocode city name to lat/lon using Open-Meteo Geocoding API
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await axios.get(geocodeUrl);
    
    let lat = 25.3176; // Varanasi default lat
    let lon = 82.9739; // Varanasi default lon
    let resolvedCity = 'Varanasi';

    if (geoResponse.data && geoResponse.data.results && geoResponse.data.results.length > 0) {
      const result = geoResponse.data.results[0];
      lat = result.latitude;
      lon = result.longitude;
      resolvedCity = result.name + (result.admin1 ? `, ${result.admin1}` : '');
    }

    // 2. Fetch forecast data from Open-Meteo
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const forecastResponse = await axios.get(forecastUrl);
    const forecast = forecastResponse.data;

    const temp = forecast.current.temperature_2m;
    const humidity = forecast.current.relative_humidity_2m;
    const windSpeed = forecast.current.wind_speed_10m;
    const rainChance = forecast.daily.precipitation_probability_max[0] || 0;

    // 3. Generate agronomic advice
    let advice = 'Weather is normal. Follow your regular irrigation schedule.';
    if (rainChance > 70) {
      advice = '🌧️ Heavy rain expected (chance > 70%). Do not irrigate today to save water and prevent root rot.';
    } else if (temp > 38) {
      advice = '🔥 High heat alert! Irrigate crops in the evening or early morning to minimize evaporation loss.';
    } else if (windSpeed > 25) {
      advice = '💨 High winds detected. Avoid applying foliar spray fertilizers or chemical pesticides today to prevent drift.';
    } else if (humidity < 30) {
      advice = '🌵 Low humidity levels. Monitor crops closely for moisture stress and heat stress signs.';
    }

    res.json({
      success: true,
      city: resolvedCity,
      coordinates: { lat, lon },
      current: {
        temp,
        humidity,
        windSpeed,
        rainChance,
        weatherCode: forecast.current.weather_code
      },
      advice
    });

  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather: ' + error.message });
  }
};

// ── POST /api/assistant/chatbot ────────────────────────────────────────────────
exports.chatbot = async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const apiKey = process.env.MISTRAL_API_KEY;

  // System instructions restricting prompt strictly to Agriculture
  const systemInstruction = 
    "You are an Indian Agriculture Expert. You help Indian farmers with crop diseases, irrigation, soil health, government schemes, and best farming practices.\n" +
    "Guidelines:\n" +
    "1. Answer ONLY farming, agriculture, crop, livestock, weather, mandi, and soil-related questions.\n" +
    "2. If the user asks an unrelated question (such as coding, general knowledge, movies, history, math, writing stories, or non-agricultural tasks), politely refuse to answer and state that you can only assist with farming questions.\n" +
    "3. Keep answers practical, structured, and easy for farmers to understand.\n" +
    "4. Use bullet points where appropriate.";

  // FALLBACK MOCK CHATBOT LOGIC (Runs if API Key is missing or invalid)
  if (!apiKey || apiKey === 'your_mistral_api_key_here') {
    console.warn('⚠️ Mistral API Key not set. Using rule-based fallback response.');
    
    const query = message.toLowerCase();
    let reply = '';

    if (query.includes('tomato') || query.includes('tamatar')) {
      reply = "🍅 **Tomato Care Advice:**\n- Watch out for *Early Blight* (spots on lower leaves) and *Late Blight*.\n- Maintain 5-7 days watering interval.\n- Apply Calcium Ammonium Nitrate to prevent blossom end rot.\n- Use stakes to keep fruits off the ground.";
    } else if (query.includes('wheat') || query.includes('gehu')) {
      reply = "🌾 **Wheat Cultivation Advice:**\n- Best sowing time is November to December.\n- Keep soil moist during critical stages like Crown Root Initiation (CRI) at 20-25 days after sowing.\n- Recommended fertilizer dosage: N:P:K at 120:60:40 kg/hectare.";
    } else if (query.includes('potato') || query.includes('aloo')) {
      reply = "🥔 **Potato Cultivation Advice:**\n- Ensure sandy-loam soil with good drainage.\n- Watch out for Late Blight; apply copper-based fungicides if dark spots appear.\n- Water every 7-10 days depending on soil moisture.";
    } else if (query.includes('fertilizer') || query.includes('khad')) {
      reply = "🧪 **Fertilizer Recommendation:**\n- Use N-P-K (Nitrogen, Phosphorus, Potassium) in ratios according to your crop type (e.g. 4:2:1 for cereal crops).\n- Supplement with organic cow dung manure (compost) to enrich soil microbes.\n- Test soil pH before applying heavy fertilizers.";
    } else if (query.includes('hello') || query.includes('hi') || query.includes('namaste')) {
      reply = "🙏 **Namaste!** I am your Smart Farmer Assistant. How can I help you today with crops, weather, mandi prices, soil, or government schemes?";
    } else if (query.includes('scheme') || query.includes('yojana') || query.includes('pm kisan')) {
      reply = "🏛️ **Government Schemes:**\n- Under **PM Kisan Samman Nidhi**, eligible farmers receive ₹6,000 yearly.\n- **Kisan Credit Card (KCC)** offers crop loans up to ₹3 Lakhs at 4% interest.\n- Select your state on our Schemes tab to browse all schemes!";
    } else if (query.includes('soil') || query.includes('mitti')) {
      reply = "🌱 **Soil Health Tip:**\n- **Black Soil** is great for Cotton and has high water retention.\n- **Alluvial Soil** is highly fertile and supports Rice/Wheat.\n- Check out our 'Soil Advisor' tab to view suitable crops and fertilizers for each soil type!";
    } else {
      reply = "🤖 **Smart Farmer Assistant (Local Mode):**\n" +
              "To enable full AI capabilities, please add a valid `MISTRAL_API_KEY` to your backend `.env` file.\n\n" +
              "Currently, in local mode, I can help you with topics like: *Tomatoes, Wheat, Potatoes, Fertilizers, Government Schemes, and Soil Health*. What would you like to know about?";
    }

    return res.json({
      success: true,
      message: reply,
      model: 'local-fallback'
    });
  }

  try {
    // Structure chat message payload
    const messages = [
      { role: 'system', content: systemInstruction }
    ];

    // Include history if provided
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
      });
    }

    messages.push({ role: 'user', content: message });

    // Request to Mistral API
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model: 'mistral-small-latest',
      messages: messages,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const reply = response.data.choices[0].message.content;

    res.json({
      success: true,
      message: reply,
      model: 'mistral-small'
    });

  } catch (error) {
    console.error('Mistral AI error:', error.response?.data || error.message);
    res.status(502).json({ 
      error: 'Failed to communicate with Mistral AI: ' + (error.response?.data?.message || error.message),
      fallback: 'Please check your MISTRAL_API_KEY is active and valid.' 
    });
  }
};

// ── GET /api/assistant/schemes ────────────────────────────────────────────────
exports.getSchemes = async (req, res) => {
  const state = req.query.state;
  const data = await loadJsonFile('schemes.json');
  
  if (!data) {
    return res.status(500).json({ error: 'Schemes database is unavailable.' });
  }

  if (state) {
    const stateSchemes = data[state] || [];
    return res.json({ success: true, schemes: stateSchemes });
  }

  res.json({ success: true, allSchemes: data });
};

// ── GET /api/assistant/calendar ───────────────────────────────────────────────
exports.getCalendar = async (req, res) => {
  const state = req.query.state;
  const data = await loadJsonFile('calendar.json');

  if (!data) {
    return res.status(500).json({ error: 'Crop calendar database is unavailable.' });
  }

  if (state) {
    const stateCalendar = data[state] || {};
    return res.json({ success: true, calendar: stateCalendar });
  }

  res.json({ success: true, allCalendars: data });
};

// ── GET /api/assistant/mandi ──────────────────────────────────────────────────
exports.getMandiPrices = async (req, res) => {
  const state = req.query.state;
  const data = await loadJsonFile('mandi.json');

  if (!data) {
    return res.status(500).json({ error: 'Mandi prices database is unavailable.' });
  }

  // Simulate price variation on every load (adds realism)
  const randomizePrices = (mandiList) => {
    return mandiList.map(item => {
      const variation = Math.floor((Math.random() - 0.5) * 50); // +/- 25 Rs fluctuation
      return { ...item, price: item.price + variation };
    });
  };

  if (state) {
    const stateMandi = data[state] || [];
    return res.json({ success: true, mandi: randomizePrices(stateMandi) });
  }

  // Apply randomization to all mandi items
  const randomizedData = {};
  for (const st in data) {
    randomizedData[st] = randomizePrices(data[st]);
  }

  res.json({ success: true, allMandiPrices: randomizedData });
};

// ── GET /api/assistant/soil ───────────────────────────────────────────────────
exports.getSoilInfo = async (req, res) => {
  const data = await loadJsonFile('soil.json');

  if (!data) {
    return res.status(500).json({ error: 'Soil database is unavailable.' });
  }

  res.json({ success: true, soil: data });
};
