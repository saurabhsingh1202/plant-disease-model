
# 🌾 KrishiSathi AI — Farmer's Friend & Crop Diagnostics

<div align="center">

![KrishiSathi AI Banner](https://img.shields.io/badge/KrishiSathi_AI-Farmers_Friend-22c55e?style=for-the-badge&logo=leaf&logoColor=white)

[![Mistral AI](https://img.shields.io/badge/LLM_Chatbot-Mistral_Small-7c3aed?style=flat&logo=openai&logoColor=white)](https://mistral.ai)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)

> 🧠 **AI-Powered Agriculture Ecosystem**: Combines a **CNN deep learning model** for classifying 38 plant leaf diseases with **Mistral Small AI** for farmer queries, real-time weather alerts, crop calendars, soil advice, government schemes, and mandi rates.

</div>

---

## 🔄 Recent Updates & Changelog

This project has evolved from a standalone machine learning model into a comprehensive full-stack ecosystem. Here is what has been updated and changed:

- **Rebranded to KrishiSathi AI**: Replaced placeholder project names with **KrishiSathi AI — Farmer's Friend** to better align with the application's utility.
- **Full MERN Stack Architecture**: Added a complete web application wrapper:
  - **Frontend**: A modern, interactive React 19 + Vite dashboard featuring glassmorphic UI tokens and full responsive layouts.
  - **Backend**: An Express & Node.js REST API server handling data routing, database operations, and external API integrations.
  - **Database**: MongoDB (via Mongoose) to persist prediction diagnostics history and analytics.
- **Multilingual Support**: Integrated complete client translation context supporting **5 languages**: English, Hindi (हिन्दी), Bhojpuri (भोजपुरी), Marathi (मराठी), and Tamil (தமிழ்).
- **Mistral AI Farmer Chatbot**: Integrated the Mistral AI API (`mistral-small-latest`) to provide interactive, contextual responses to queries on crops, pests, and agricultural advice.
- **Open-Meteo Weather System**: Integrated geolocation-based weather queries with real-time temperature, wind, and rain telemetry and farming-specific tips.
- **Localized Agricultural Features**: Added databases and APIs for Indian farming:
  - Interactive Crop Calendar supporting seasonal timelines for all 28 Indian states.
  - Live (simulated) Mandi crop market rates for key regional hubs.
  - Searchable Government Schemes directory (e.g., PM-Kisan, PMFBY, KCC).
  - Detailed Soil Advisor detailing profiles for 12 major Indian soil types.
- **Analytics Dashboard**: Added visual charts and telemetry tracking prediction volumes, healthy-to-diseased crop ratios, and severity distribution.
- **Repository Optimization**: Removed large virtual environment files (`venv312`) from repository tracking and properly structured `.gitignore`.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔍 **Plant Disease Detection** | Upload leaf images → get diagnosis in under 3 seconds via CNN model |
| 🤖 **Farmer AI Chatbot** | Conversational assistant powered by **Mistral Small** giving custom agricultural recommendations |
| 🌦️ **Agronomic Weather Forecast** | Open-Meteo integration offering temperature, rain, wind telemetry, and farming advice |
| 📅 **State Crop Calendar** | Interactive sowing, planting, and harvesting timeline for **all 28 Indian States** |
| 🏛️ **Government Schemes** | Searchable directory of central and state-specific agricultural schemes (e.g. PM Kisan, KCC) |
| 🌾 **Soil Advisor** | Comprehensive guides for **12 soil types** covering advantages, limitations, crops, and pest management |
| 💰 **Simulated Mandi Rates** | Live crop prices across major hubs (Varanasi, Lucknow, Patna, Pune, Nagpur, Ludhiana) |
| 📊 **Analytics Dashboard** | Visual metrics tracking total predictions, healthy vs diseased ratios, and severity |
| 🌐 **Multilingual Translation** | Complete client support for **5 languages**: English, Hindi, Bhojpuri, Marathi, and Tamil |

---

## 🏗️ Project Architecture
