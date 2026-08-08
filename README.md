
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



---

## 🧠 ML Model Details

| Property | Value |
|---|---|
| **Architecture** | Convolutional Neural Network (CNN) |
| **Framework** | TensorFlow 2.x / Keras |
| **Input Shape** | 224 × 224 × 3 (RGB) |
| **Output Classes** | 38 disease categories |
| **Dataset** | PlantVillage (54,305 labeled images) |
| **Model File** | `plant_model.h5` |

---

## 🌐 API Endpoints

### Backend (Node.js Express — Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Node server health status |
| `POST` | `/api/predictions/predict` | Upload leaf image → run Flask inference → save to DB |
| `GET` | `/api/predictions/history` | Get paginated diagnostic history |
| `GET` | `/api/predictions/stats` | Aggregated statistics for analytics dashboard |
| `DELETE` | `/api/predictions/:id` | Delete a prediction record and its image |
| `GET` | `/api/assistant/weather` | Open-Meteo geocoding + weather telemetry + advice |
| `POST` | `/api/assistant/chatbot` | Chat endpoint connected to **Mistral AI** |
| `GET` | `/api/assistant/schemes` | Fetch government schemes filtered by state |
| `GET` | `/api/assistant/calendar` | Fetch crop seasonal calendars filtered by state |
| `GET` | `/api/assistant/mandi` | Fetch crop mandi market rates (with simulated variation) |
| `GET` | `/api/assistant/soil` | Fetch details of the 12 soil profiles |

### ML Microservice (Python Flask — Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Verify if Flask is running and model is loaded |
| `POST` | `/predict` | Accept image → run CNN tensor preprocessing → return top predictions |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Lucide React, React Router 7, React Dropzone |
| **Styling** | Vanilla CSS (Glassmorphism & dark-theme tokens) |
| **Backend** | Node.js, Express, Axios, Multer, dotenv |
| **Database** | MongoDB, Mongoose |
| **ML Engine** | Python 3, Flask, TensorFlow, Pillow, NumPy |
| **LLM Engine** | Mistral AI API (`mistral-small-latest` model) |

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18+
- **Python** v3.10+ (with pip)
- **MongoDB** running locally or a MongoDB Atlas connection URI
- **Mistral API Key** (for chatbot integration)
- The model file `plant_model.h5` inside `ml_service/`

---

### 1️⃣ Clone and Setup Local Copy
```bash
git clone https://github.com/saurabhsingh1202/plant-disease-model.git
cd plant-disease-model



2️⃣ Configure Environment Files
backend/.env

env


PORT=5000
MONGODB_URI=mongodb://localhost:27017/plant-disease-db
ML_SERVICE_URL=http://localhost:5001
CLIENT_URL=http://localhost:5173
MISTRAL_API_KEY=your_mistral_api_key_here
frontend/.env

env


VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
3️⃣ Start Services
A. Start Flask ML Service
bash


cd ml_service
# Activate virtual environment
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux
# Start server
python app.py
Microservice active at http://localhost:5001

B. Start Express Backend
bash


cd backend
npm install
npm run dev
REST Server active at http://localhost:5000

C. Start Vite Client
bash


cd frontend
npm install
npm run dev
Frontend running at http://localhost:5173

👨‍💻 Author
Saurabh Kumar Singh

🐙 GitHub: @saurabhsingh1202
📓 Model Notebook: plant-disease-prediction.ipynb
📄 License
This project is open-source and licensed under the 
MIT License
.

Made with 🌾 and AI · KrishiSathi AI 2026

