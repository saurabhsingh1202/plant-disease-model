# 🌿 PlantGuard AI — Plant Disease Detection System

<div align="center">

![PlantGuard AI Banner](https://img.shields.io/badge/PlantGuard_AI-Plant_Disease_Detection-4ade80?style=for-the-badge&logo=leaf&logoColor=white)

[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)

> 🧠 **CNN deep learning model** for classifying plant leaf diseases across **38 categories** and **14 plant types**, served through a full **MERN stack** web application.

</div>

---

## 🚀 Live Demo Features

| Feature | Description |
|---|---|
| 🔍 **Instant Detection** | Upload any leaf image → get diagnosis in <3 seconds |
| 📊 **38 Disease Classes** | Covers all major crop diseases from the PlantVillage dataset |
| 💊 **Treatment Advice** | Actionable treatment recommendations for every diagnosis |
| 📈 **Confidence Scoring** | Top-3 predictions with probability scores |
| 🗃️ **Prediction History** | Stored in MongoDB — browse all past analyses |
| ⚡ **Real-time API** | Flask microservice runs TensorFlow inference |

---

## 🏗️ Project Architecture

```
plant-disease-detection/
├── 📁 frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/           # Navbar, Footer
│   │   ├── pages/                # Home, Predict, History, About
│   │   ├── App.jsx               # Router + Toaster
│   │   └── index.css             # Design System (Dark Theme)
│   └── package.json
│
├── 📁 backend/                   # Node.js + Express API
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Prediction logic
│   ├── models/Prediction.js      # Mongoose schema
│   ├── routes/                   # REST endpoints
│   ├── middleware/upload.js      # Multer file handler
│   └── server.js
│
├── 📁 ml_service/               # Python Flask ML Microservice
│   ├── app.py                    # Flask API + TF model inference
│   ├── plant_model.h5            # Trained CNN model (add this file!)
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 🧠 ML Model Details

| Property | Value |
|---|---|
| **Architecture** | Convolutional Neural Network (CNN) |
| **Framework** | TensorFlow 2.x / Keras |
| **Input Shape** | 224 × 224 × 3 (RGB) |
| **Output Classes** | 38 disease categories |
| **Dataset** | PlantVillage (54,305 labeled images) |
| **Model File** | `plant_model.h5` (Keras SavedModel) |

### 🌱 Supported Plants & Diseases (38 Classes)

| Plant | Classes |
|-------|---------|
| 🍅 Tomato | 10 (Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy) |
| 🍎 Apple | 4 (Apple Scab, Black Rot, Cedar Apple Rust, Healthy) |
| 🌽 Corn | 4 (Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy) |
| 🍇 Grape | 4 (Black Rot, Esca, Leaf Blight, Healthy) |
| 🥔 Potato | 3 (Early Blight, Late Blight, Healthy) |
| 🍒 Cherry | 2 (Powdery Mildew, Healthy) |
| 🍑 Peach | 2 (Bacterial Spot, Healthy) |
| 🫑 Pepper | 2 (Bacterial Spot, Healthy) |
| 🍓 Strawberry | 2 (Leaf Scorch, Healthy) |
| 🍊 Orange | 1 (Huanglongbing / Citrus Greening) |
| 🥦 Squash | 1 (Powdery Mildew) |
| 🫐 Blueberry | 1 (Healthy) |
| 🌱 Soybean | 1 (Healthy) |
| 🍓 Raspberry | 1 (Healthy) |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.9+ with pip
- **MongoDB** (local or MongoDB Atlas)
- The trained model file: `plant_model.h5` (from the [original repo](https://github.com/saurabhsingh1202/plant-disease-model))

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/saurabhsingh1202/plant-disease-model.git
cd plant-disease-detection
```

---

### 2️⃣ Setup the ML Service (Python Flask)

```bash
cd ml_service

# Copy your trained model here
cp /path/to/plant_model.h5 ./

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the Flask server (runs on port 5001)
python app.py
```

✅ Flask ML service running at `http://localhost:5001`

---

### 3️⃣ Setup the Backend (Node.js + Express)

```bash
cd backend

# Install packages
npm install

# Configure environment
# Edit .env with your MongoDB URI if needed:
# MONGODB_URI=mongodb://localhost:27017/plant-disease-db

# Start the backend (runs on port 5000)
npm run dev
```

✅ Express API running at `http://localhost:5000`

---

### 4️⃣ Setup the Frontend (React + Vite)

```bash
cd frontend

# Install packages
npm install

# Start the dev server (runs on port 5173)
npm run dev
```

✅ React app running at `http://localhost:5173`

---

## 🌐 API Endpoints

### Backend (Node.js — Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/predictions/predict` | Upload image → get prediction |
| `GET` | `/api/predictions/history` | Get prediction history |
| `GET` | `/api/predictions/stats` | Aggregate statistics |
| `DELETE` | `/api/predictions/:id` | Delete a prediction |

### ML Service (Python Flask — Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check if model is loaded |
| `POST` | `/predict` | Run CNN inference on uploaded image |

---

## 🖼️ How It Works

```
User → React UI → Node.js API → Flask ML Service
                                    ↓
                              TensorFlow CNN
                              (plant_model.h5)
                                    ↓
              MongoDB ← Node.js  ← Prediction Result
                                    ↓
                              React UI displays:
                              - Disease Name
                              - Confidence Score
                              - Severity Level
                              - Treatment Plan
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Framer Motion |
| **Styling** | Vanilla CSS (Dark Theme Design System) |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | MongoDB, Mongoose |
| **ML Service** | Python, Flask, TensorFlow 2.x, Keras, Pillow |
| **HTTP Client** | Axios |

---

## 📁 Environment Variables

**`backend/.env`**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/plant-disease-db
ML_SERVICE_URL=http://localhost:5001
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

---

## 👨‍💻 Author

**Saurabh Kumar Singh**

- 🐙 GitHub: [@saurabhsingh1202](https://github.com/saurabhsingh1202)
- 📓 Original Model Notebook: [plant-disease-prediction.ipynb](https://github.com/saurabhsingh1202/plant-disease-model/blob/main/plant-disease-prediction.ipynb)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with 🌿 and deep learning · PlantGuard AI 2026

</div>
