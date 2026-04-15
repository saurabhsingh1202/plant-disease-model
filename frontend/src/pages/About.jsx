import { Github, Brain, Database, Cpu, Layers } from 'lucide-react';

const diseaseClasses = [
  { plant: '🍎 Apple', count: 4, diseases: ['Apple Scab', 'Black Rot', 'Cedar Apple Rust', 'Healthy'] },
  { plant: '🫐 Blueberry', count: 1, diseases: ['Healthy'] },
  { plant: '🍒 Cherry', count: 2, diseases: ['Powdery Mildew', 'Healthy'] },
  { plant: '🌽 Corn', count: 4, diseases: ['Gray Leaf Spot', 'Common Rust', 'Northern Leaf Blight', 'Healthy'] },
  { plant: '🍇 Grape', count: 4, diseases: ['Black Rot', 'Esca (Black Measles)', 'Leaf Blight', 'Healthy'] },
  { plant: '🍊 Orange', count: 1, diseases: ['Huanglongbing (Citrus Greening)'] },
  { plant: '🍑 Peach', count: 2, diseases: ['Bacterial Spot', 'Healthy'] },
  { plant: '🫑 Pepper', count: 2, diseases: ['Bacterial Spot', 'Healthy'] },
  { plant: '🥔 Potato', count: 3, diseases: ['Early Blight', 'Late Blight', 'Healthy'] },
  { plant: '🍓 Strawberry', count: 2, diseases: ['Leaf Scorch', 'Healthy'] },
  { plant: '🌱 Soybean', count: 1, diseases: ['Healthy'] },
  { plant: '🥦 Squash', count: 1, diseases: ['Powdery Mildew'] },
  { plant: '🍓 Raspberry', count: 1, diseases: ['Healthy'] },
  { plant: '🍅 Tomato', count: 10, diseases: ['Bacterial Spot', 'Early Blight', 'Late Blight', 'Leaf Mold', 'Septoria Leaf Spot', 'Spider Mites', 'Target Spot', 'Yellow Leaf Curl Virus', 'Mosaic Virus', 'Healthy'] },
];

const techStack = [
  { emoji: '🐍', name: 'Python 3.10' },
  { emoji: '🧠', name: 'TensorFlow 2.x' },
  { emoji: '⚡', name: 'Keras CNN' },
  { emoji: '🌐', name: 'Flask API' },
  { emoji: '⚛️', name: 'React + Vite' },
  { emoji: '🟢', name: 'Node.js + Express' },
  { emoji: '🍃', name: 'MongoDB' },
  { emoji: '📦', name: 'Multer + Axios' },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <div className="section-label" style={{ justifyContent: 'center' }}><Brain size={13} /> About the Project</div>
          <h1 className="section-title" style={{ textAlign: 'center', marginBottom: 16 }}>
            Plant Disease Detection<br />
            <span style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Using Deep Learning
            </span>
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.8 }}>
            A CNN-based model trained on the PlantVillage dataset to classify plant diseases with high accuracy.
            Built with TensorFlow/Keras and served through a MERN stack web application.
          </p>
        </div>

        {/* Model Architecture */}
        <div className="about-grid">
          <div className="about-text">
            <h2>The ML Model</h2>
            <p>
              The core of PlantGuard AI is a <strong style={{ color: 'var(--text-primary)' }}>Convolutional Neural Network (CNN)</strong> trained
              on the <strong style={{ color: 'var(--text-primary)' }}>PlantVillage dataset</strong>, one of the most comprehensive plant disease
              image repositories available.
            </p>
            <p>
              The model processes 224×224 RGB images through multiple convolutional layers, learning to distinguish
              between <strong style={{ color: 'var(--green-400)' }}>38 disease categories</strong> across 14 plant types.
              After training, it achieves high classification accuracy with confidence scores for each prediction.
            </p>
            <p>
              The trained model is saved as <code style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4, fontSize: 13, color: 'var(--green-400)' }}>plant_model.h5</code> and
              loaded at runtime by a Flask API that handles image preprocessing and inference.
            </p>
          </div>
          <div>
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Cpu size={20} style={{ color: 'var(--green-400)' }} />
                <span style={{ fontWeight: 700 }}>Model Specifications</span>
              </div>
              {[
                { label: 'Architecture', value: 'Convolutional Neural Network (CNN)' },
                { label: 'Framework', value: 'TensorFlow / Keras' },
                { label: 'Input Size', value: '224 × 224 × 3 (RGB)' },
                { label: 'Output Classes', value: '38 Disease Categories' },
                { label: 'Dataset', value: 'PlantVillage (54,305 images)' },
                { label: 'Model Format', value: 'Keras .h5 SavedModel' },
              ].map((spec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{spec.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>System Architecture</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {[
              { step: '1', icon: '📸', title: 'Frontend', subtitle: 'React + Vite', desc: 'User uploads leaf image via drag-and-drop UI' },
              { step: '2', icon: '⚙️', title: 'Node.js API', subtitle: 'Express + Multer', desc: 'Handles upload, stores to MongoDB, proxies to ML' },
              { step: '3', icon: '🐍', title: 'Flask ML', subtitle: 'TensorFlow', desc: 'Loads H5 model, preprocesses image, runs inference' },
              { step: '4', icon: '📊', title: 'Results', subtitle: 'JSON Response', desc: 'Disease name, confidence %, severity & treatment' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '32px 24px',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                textAlign: 'center',
                position: 'relative',
                background: i % 2 === 0 ? 'transparent' : 'rgba(74,222,128,0.02)'
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--green-400)', fontWeight: 600, marginBottom: 12, padding: '2px 10px', background: 'var(--green-glow)', borderRadius: 'var(--radius-full)', display: 'inline-block' }}>
                  {s.subtitle}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                {i < 3 && (
                  <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', zIndex: 2, fontSize: 18, color: 'var(--green-400)' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Tech Stack</h2>
          <div className="tech-stack" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {techStack.map((t, i) => (
              <div key={i} className="tech-item">
                <span className="tech-emoji">{t.emoji}</span>
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disease Classes Table */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Supported Plant Disease Classes</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15 }}>
            The model can classify <strong style={{ color: 'var(--green-400)' }}>38 categories</strong> across 14 plant types from the PlantVillage dataset.
          </p>
          <div className="disease-table-wrapper">
            <table className="disease-table">
              <thead>
                <tr>
                  <th>Plant</th>
                  <th>Classes</th>
                  <th>Diseases Covered</th>
                </tr>
              </thead>
              <tbody>
                {diseaseClasses.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{row.plant}</td>
                    <td>
                      <span className="badge badge-healthy">{row.count} class{row.count > 1 ? 'es' : ''}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{row.diseases.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 40 }}>
          <a
            href="https://github.com/saurabhsingh1202/plant-disease-model"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            <Github size={18} /> View on GitHub
          </a>
          <a
            href="https://github.com/saurabhsingh1202/plant-disease-model/blob/main/plant-disease-prediction.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            <Layers size={18} /> View Notebook
          </a>
        </div>
      </div>
    </div>
  );
}
