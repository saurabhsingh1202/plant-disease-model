from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import os
import traceback

app = Flask(__name__)
CORS(app)

# ── Disease classes (38 categories from PlantVillage dataset) ──────────────────
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# ── Disease details for enriched response ─────────────────────────────────────
DISEASE_INFO = {
    'Apple___Apple_scab': {
        'plant': 'Apple', 'disease': 'Apple Scab',
        'description': 'A fungal disease causing dark, scabby lesions on leaves and fruit.',
        'treatment': 'Apply fungicides like captan or myclobutanil. Remove infected leaves. Ensure good air circulation.',
        'severity': 'medium', 'is_healthy': False
    },
    'Apple___Black_rot': {
        'plant': 'Apple', 'disease': 'Black Rot',
        'description': 'Causes brown leaf spots, mummified fruit, and cankers on branches.',
        'treatment': 'Prune infected branches, apply copper-based fungicides, remove dead wood.',
        'severity': 'high', 'is_healthy': False
    },
    'Apple___Cedar_apple_rust': {
        'plant': 'Apple', 'disease': 'Cedar Apple Rust',
        'description': 'Orange-yellow spots on leaves caused by a fungus that alternates between apples and cedars.',
        'treatment': 'Apply fungicides at bud break. Remove nearby juniper/cedar trees if possible.',
        'severity': 'medium', 'is_healthy': False
    },
    'Apple___healthy': {
        'plant': 'Apple', 'disease': 'Healthy',
        'description': 'The plant appears healthy with no visible signs of disease.',
        'treatment': 'Continue regular watering, fertilizing, and monitoring.',
        'severity': 'none', 'is_healthy': True
    },
    'Blueberry___healthy': {
        'plant': 'Blueberry', 'disease': 'Healthy',
        'description': 'The blueberry plant appears healthy.',
        'treatment': 'Maintain soil acidity (pH 4.5–5.5), regular pruning and watering.',
        'severity': 'none', 'is_healthy': True
    },
    'Cherry_(including_sour)___Powdery_mildew': {
        'plant': 'Cherry', 'disease': 'Powdery Mildew',
        'description': 'White powdery fungal coating on leaves and shoots.',
        'treatment': 'Apply sulfur-based fungicides, improve air circulation, avoid overhead watering.',
        'severity': 'medium', 'is_healthy': False
    },
    'Cherry_(including_sour)___healthy': {
        'plant': 'Cherry', 'disease': 'Healthy',
        'description': 'The cherry plant appears healthy.',
        'treatment': 'Maintain proper pruning and monitor for pests.',
        'severity': 'none', 'is_healthy': True
    },
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
        'plant': 'Corn', 'disease': 'Cercospora Leaf Spot / Gray Leaf Spot',
        'description': 'Fungal disease causing rectangular tan/gray lesions parallel to leaf veins.',
        'treatment': 'Use resistant hybrids, rotate crops, apply fungicides if severe.',
        'severity': 'medium', 'is_healthy': False
    },
    'Corn_(maize)___Common_rust_': {
        'plant': 'Corn', 'disease': 'Common Rust',
        'description': 'Reddish-brown pustules on both leaf surfaces.',
        'treatment': 'Plant resistant varieties, apply fungicides early in the season.',
        'severity': 'medium', 'is_healthy': False
    },
    'Corn_(maize)___Northern_Leaf_Blight': {
        'plant': 'Corn', 'disease': 'Northern Leaf Blight',
        'description': 'Long, elliptical green-gray lesions running parallel to leaf margins.',
        'treatment': 'Use resistant hybrids, apply triazole or strobilurin fungicides.',
        'severity': 'high', 'is_healthy': False
    },
    'Corn_(maize)___healthy': {
        'plant': 'Corn', 'disease': 'Healthy',
        'description': 'The corn plant appears healthy.',
        'treatment': 'Maintain proper irrigation and fertilization schedules.',
        'severity': 'none', 'is_healthy': True
    },
    'Grape___Black_rot': {
        'plant': 'Grape', 'disease': 'Black Rot',
        'description': 'Brown circular lesions on leaves and black shriveled berries.',
        'treatment': 'Apply fungicides from bud break, remove mummified berries.',
        'severity': 'high', 'is_healthy': False
    },
    'Grape___Esca_(Black_Measles)': {
        'plant': 'Grape', 'disease': 'Esca (Black Measles)',
        'description': 'Complex fungal disease causing tiger-stripe leaf patterns and dried berries.',
        'treatment': 'Prune during dry weather, apply wound protectants, remove severely infected vines.',
        'severity': 'high', 'is_healthy': False
    },
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
        'plant': 'Grape', 'disease': 'Leaf Blight (Isariopsis Leaf Spot)',
        'description': 'Dark brown irregular spots on older leaves.',
        'treatment': 'Apply copper-based fungicides, ensure good canopy ventilation.',
        'severity': 'medium', 'is_healthy': False
    },
    'Grape___healthy': {
        'plant': 'Grape', 'disease': 'Healthy',
        'description': 'The grapevine appears healthy.',
        'treatment': 'Continue proper trellising, pruning, and disease monitoring.',
        'severity': 'none', 'is_healthy': True
    },
    'Orange___Haunglongbing_(Citrus_greening)': {
        'plant': 'Orange', 'disease': 'Huanglongbing (Citrus Greening)',
        'description': 'Bacterial disease causing yellow mottled leaves and misshapen bitter fruit. No cure exists.',
        'treatment': 'Remove infected trees immediately. Control Asian citrus psyllid vectors. Use certified disease-free plants.',
        'severity': 'critical', 'is_healthy': False
    },
    'Peach___Bacterial_spot': {
        'plant': 'Peach', 'disease': 'Bacterial Spot',
        'description': 'Water-soaked spots on leaves, fruit, and twigs caused by Xanthomonas bacteria.',
        'treatment': 'Apply copper bactericides, use resistant varieties, avoid overhead irrigation.',
        'severity': 'high', 'is_healthy': False
    },
    'Peach___healthy': {
        'plant': 'Peach', 'disease': 'Healthy',
        'description': 'The peach plant appears healthy.',
        'treatment': 'Maintain regular thinning, fertilization, and irrigation.',
        'severity': 'none', 'is_healthy': True
    },
    'Pepper,_bell___Bacterial_spot': {
        'plant': 'Bell Pepper', 'disease': 'Bacterial Spot',
        'description': 'Raised, scab-like spots on leaves and fruit caused by Xanthomonas bacteria.',
        'treatment': 'Use copper-based bactericides, plant resistant varieties, practice crop rotation.',
        'severity': 'high', 'is_healthy': False
    },
    'Pepper,_bell___healthy': {
        'plant': 'Bell Pepper', 'disease': 'Healthy',
        'description': 'The bell pepper plant appears healthy.',
        'treatment': 'Ensure consistent watering and balanced fertilization.',
        'severity': 'none', 'is_healthy': True
    },
    'Potato___Early_blight': {
        'plant': 'Potato', 'disease': 'Early Blight',
        'description': 'Dark concentric ring lesions (target board pattern) on older leaves.',
        'treatment': 'Apply chlorothalonil or mancozeb fungicides. Remove infected tissue.',
        'severity': 'medium', 'is_healthy': False
    },
    'Potato___Late_blight': {
        'plant': 'Potato', 'disease': 'Late Blight',
        'description': 'Water-soaked greasy lesions that quickly turn brown. Caused the Irish Potato Famine.',
        'treatment': 'Apply fungicides preventively, destroy infected plants, avoid overhead watering.',
        'severity': 'critical', 'is_healthy': False
    },
    'Potato___healthy': {
        'plant': 'Potato', 'disease': 'Healthy',
        'description': 'The potato plant appears healthy.',
        'treatment': 'Monitor regularly, maintain proper hilling and irrigation.',
        'severity': 'none', 'is_healthy': True
    },
    'Raspberry___healthy': {
        'plant': 'Raspberry', 'disease': 'Healthy',
        'description': 'The raspberry plant appears healthy.',
        'treatment': 'Prune old canes after fruiting, maintain good air circulation.',
        'severity': 'none', 'is_healthy': True
    },
    'Soybean___healthy': {
        'plant': 'Soybean', 'disease': 'Healthy',
        'description': 'The soybean plant appears healthy.',
        'treatment': 'Monitor for pests, maintain soil fertility with proper N-P-K balance.',
        'severity': 'none', 'is_healthy': True
    },
    'Squash___Powdery_mildew': {
        'plant': 'Squash', 'disease': 'Powdery Mildew',
        'description': 'White powdery spots on leaf surfaces caused by Erysiphe cichoracearum.',
        'treatment': 'Apply potassium bicarbonate or neem oil. Remove infected leaves.',
        'severity': 'medium', 'is_healthy': False
    },
    'Strawberry___Leaf_scorch': {
        'plant': 'Strawberry', 'disease': 'Leaf Scorch',
        'description': 'Small purplish spots that enlarge to cause a scorched appearance on leaves.',
        'treatment': 'Apply fungicides, remove infected leaves, improve air circulation.',
        'severity': 'medium', 'is_healthy': False
    },
    'Strawberry___healthy': {
        'plant': 'Strawberry', 'disease': 'Healthy',
        'description': 'The strawberry plant appears healthy.',
        'treatment': 'Apply mulch, maintain proper plant spacing, and monitor for runners.',
        'severity': 'none', 'is_healthy': True
    },
    'Tomato___Bacterial_spot': {
        'plant': 'Tomato', 'disease': 'Bacterial Spot',
        'description': 'Small, water-soaked spots turning brown with yellow halo on leaves and fruit.',
        'treatment': 'Use copper bactericides, practice crop rotation, remove infected plant material.',
        'severity': 'high', 'is_healthy': False
    },
    'Tomato___Early_blight': {
        'plant': 'Tomato', 'disease': 'Early Blight',
        'description': 'Concentric ring pattern lesions on older leaves, starting from the bottom.',
        'treatment': 'Apply chlorothalonil fungicide, remove lower infected leaves, stake plants.',
        'severity': 'medium', 'is_healthy': False
    },
    'Tomato___Late_blight': {
        'plant': 'Tomato', 'disease': 'Late Blight',
        'description': 'Greasy water-soaked lesions rapidly turning brown with white mold on undersides.',
        'treatment': 'Apply fungicides preventively, destroy infected plants. Do not compost.',
        'severity': 'critical', 'is_healthy': False
    },
    'Tomato___Leaf_Mold': {
        'plant': 'Tomato', 'disease': 'Leaf Mold',
        'description': 'Yellow spots on upper leaf surface with olive-green/brown mold below.',
        'treatment': 'Improve ventilation, reduce humidity, apply fungicides.',
        'severity': 'medium', 'is_healthy': False
    },
    'Tomato___Septoria_leaf_spot': {
        'plant': 'Tomato', 'disease': 'Septoria Leaf Spot',
        'description': 'Circular spots with dark border and lighter centers with small dark dots.',
        'treatment': 'Remove infected leaves, apply copper or chlorothalonil fungicides.',
        'severity': 'medium', 'is_healthy': False
    },
    'Tomato___Spider_mites Two-spotted_spider_mite': {
        'plant': 'Tomato', 'disease': 'Spider Mites (Two-spotted)',
        'description': 'Tiny pests causing stippled, bronze or yellow discoloration with webbing.',
        'treatment': 'Apply miticides or insecticidal soap. Increase humidity. Introduce predatory mites.',
        'severity': 'medium', 'is_healthy': False
    },
    'Tomato___Target_Spot': {
        'plant': 'Tomato', 'disease': 'Target Spot',
        'description': 'Circular brown lesions with concentric rings resembling a target.',
        'treatment': 'Apply fungicides, improve air circulation, remove infected leaves.',
        'severity': 'medium', 'is_healthy': False
    },
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
        'plant': 'Tomato', 'disease': 'Yellow Leaf Curl Virus',
        'description': 'Upward leaf curling, yellowing, and stunted growth caused by whitefly-transmitted virus.',
        'treatment': 'Control whitefly vectors, remove infected plants, use virus-resistant varieties.',
        'severity': 'critical', 'is_healthy': False
    },
    'Tomato___Tomato_mosaic_virus': {
        'plant': 'Tomato', 'disease': 'Mosaic Virus',
        'description': 'Mottled light/dark green pattern on leaves, distortion, and reduced yield.',
        'treatment': 'Remove infected plants, disinfect tools, control aphid vectors, use resistant varieties.',
        'severity': 'high', 'is_healthy': False
    },
    'Tomato___healthy': {
        'plant': 'Tomato', 'disease': 'Healthy',
        'description': 'The tomato plant appears healthy with no visible signs of disease.',
        'treatment': 'Continue consistent watering at the base, stake plants, and monitor regularly.',
        'severity': 'none', 'is_healthy': True
    }
}

# ── Load Keras model ──────────────────────────────────────────────────────────
model = None

def load_model():
    global model
    try:
        import tensorflow as tf
        model_path = os.path.join(os.path.dirname(__file__), 'plant_model.h5')
        model = tf.keras.models.load_model(model_path)
        print(f"✅ Model loaded successfully from {model_path}")
        print(f"   Input shape: {model.input_shape}")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        traceback.print_exc()

def preprocess_image(image_bytes):
    """Preprocess image to match model input (224x224 RGB)."""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Please ensure plant_model.h5 exists in the ml_service directory.'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type. Please upload a plant leaf image.'}), 400

    try:
        image_bytes = file.read()
        img_array = preprocess_image(image_bytes)

        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0])) * 100

        predicted_class = CLASS_NAMES[predicted_index]
        info = DISEASE_INFO.get(predicted_class, {
            'plant': 'Unknown', 'disease': predicted_class,
            'description': 'No description available.',
            'treatment': 'Consult a plant disease specialist.',
            'severity': 'unknown', 'is_healthy': False
        })

        # Top 3 predictions
        top_indices = np.argsort(predictions[0])[::-1][:3]
        top_predictions = [
            {'class': CLASS_NAMES[i], 'confidence': round(float(predictions[0][i]) * 100, 2)}
            for i in top_indices
        ]

        return jsonify({
            'success': True,
            'prediction': {
                'class': predicted_class,
                'plant': info['plant'],
                'disease': info['disease'],
                'confidence': round(confidence, 2),
                'description': info['description'],
                'treatment': info['treatment'],
                'severity': info['severity'],
                'is_healthy': info['is_healthy'],
                'top_predictions': top_predictions
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5001, debug=False)
