import { Link } from 'react-router-dom';
import { Scan, Zap, Shield, BarChart3, Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: '🔍',
    title: 'Instant Detection',
    desc: 'Upload any plant leaf image and get disease detection results in under 3 seconds using our CNN model.'
  },
  {
    icon: '🧬',
    title: '38 Disease Classes',
    desc: 'Covers diseases across 14 plant types including tomato, potato, corn, apple, grape, and more.'
  },
  {
    icon: '💊',
    title: 'Treatment Advice',
    desc: 'Every diagnosis comes with actionable treatment recommendations and severity assessments.'
  },
  {
    icon: '📊',
    title: 'Confidence Scoring',
    desc: 'See not just the top prediction, but top-3 results with confidence percentages.'
  },
  {
    icon: '🗃️',
    title: 'Prediction History',
    desc: 'All your past analyses are stored and browsable — track your plants over time.'
  },
  {
    icon: '⚡',
    title: 'Real-Time API',
    desc: 'Powered by a Python Flask microservice running TensorFlow for fast, accurate inference.'
  }
];

const plants = [
  { emoji: '🍎', name: 'Apple' }, { emoji: '🍅', name: 'Tomato' },
  { emoji: '🥔', name: 'Potato' }, { emoji: '🌽', name: 'Corn' },
  { emoji: '🍇', name: 'Grape' }, { emoji: '🍑', name: 'Peach' },
  { emoji: '🫑', name: 'Pepper' }, { emoji: '🍓', name: 'Strawberry' },
  { emoji: '🫐', name: 'Blueberry' }, { emoji: '🍊', name: 'Orange' },
  { emoji: '🌱', name: 'Soybean' }, { emoji: '🍒', name: 'Cherry' },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div>
              <div className="hero-badge">
                <Zap size={13} />
                AI-Powered Plant Diagnostics
              </div>
              <h1 className="hero-title">
                Detect Plant Diseases <span className="gradient-text">Instantly</span> with AI
              </h1>
              <p className="hero-subtitle">
                Upload a photo of any plant leaf and our CNN deep learning model will identify
                diseases, assess severity, and recommend treatments — in seconds.
              </p>
              <div className="hero-actions">
                <Link to="/predict" className="btn btn-primary btn-lg">
                  <Scan size={18} />
                  Analyze a Plant
                </Link>
                <Link to="/about" className="btn btn-outline btn-lg">
                  Learn How It Works
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">38</div>
                  <div className="hero-stat-label">Disease Classes</div>
                </div>
                <div>
                  <div className="hero-stat-value">14</div>
                  <div className="hero-stat-label">Plant Types</div>
                </div>
                <div>
                  <div className="hero-stat-value">CNN</div>
                  <div className="hero-stat-label">Deep Learning</div>
                </div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="hero-visual">
              <div className="hero-card-visual">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Supported Plants</div>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20 }}>12 Categories</div>
                  </div>
                  <div style={{ padding: '6px 14px', background: 'var(--green-glow)', border: '1px solid var(--border-green)', borderRadius: 'var(--radius-full)', fontSize: 13, color: 'var(--green-400)', fontWeight: 600 }}>
                    ● Live
                  </div>
                </div>
                <div className="plant-icon-grid">
                  {plants.slice(0, 9).map(({ emoji, name }) => (
                    <div key={name} className="plant-icon-item">
                      <span>{emoji}</span>
                      <span className="plant-icon-label">{name}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 14, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Model Accuracy</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--green-400)', fontFamily: 'Outfit' }}>~95%+</span>
                  </div>
                  <div className="accuracy-bar">
                    <div className="accuracy-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div className="section-label"><Leaf size={13} /> Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From instant diagnosis to detailed treatment plans — PlantGuard AI covers it all.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <div className="section-label"><BarChart3 size={13} /> Process</div>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }}>
            {[
              { step: '01', icon: '📸', title: 'Upload Image', desc: 'Drag & drop or click to select a clear photo of the affected plant leaf.' },
              { step: '02', icon: '🧠', title: 'AI Analysis', desc: 'Our CNN model processes the image through 38 classification layers in real time.' },
              { step: '03', icon: '📋', title: 'Get Diagnosis', desc: 'Receive disease name, confidence score, severity rating, and treatment plan.' },
            ].map((step, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--green-400)', letterSpacing: 2, marginBottom: 20, fontFamily: 'Outfit' }}>
                  STEP {step.step}
                </div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: 52, marginBottom: 20 }}>🌿</div>
            <h2 className="section-title">Ready to Diagnose Your Plants?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
              Start with a free analysis — no sign-up required. Just upload a leaf photo and see the magic.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/predict" className="btn btn-primary btn-lg">
                <Scan size={18} />
                Start Detecting Now
              </Link>
              <a href="https://github.com/saurabhsingh1202/plant-disease-model" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                View Source Code
              </a>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              {['38 Disease Classes', 'Free to Use', 'TensorFlow CNN', 'Real-time Results'].map(tag => (
                <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--green-400)' }} />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
