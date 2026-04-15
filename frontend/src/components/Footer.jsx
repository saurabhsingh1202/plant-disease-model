import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-name">
            <span>🌿</span> PlantGuard AI
          </div>
          <p className="footer-brand-desc">
            AI-powered plant disease detection using deep learning. Upload a leaf image
            and get instant, accurate disease diagnosis with treatment recommendations.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/predict">Detect Disease</Link></li>
            <li><Link to="/history">Prediction History</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Model</h4>
          <ul className="footer-links">
            <li><a href="https://github.com/saurabhsingh1202/plant-disease-model" target="_blank" rel="noopener noreferrer">GitHub Repo</a></li>
            <li><span style={{ color: 'var(--text-muted)' }}>38 Disease Classes</span></li>
            <li><span style={{ color: 'var(--text-muted)' }}>TensorFlow / Keras</span></li>
            <li><span style={{ color: 'var(--text-muted)' }}>PlantVillage Dataset</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © 2026 PlantGuard AI · Built by Saurabh Kumar Singh
        </p>
        <a
          href="https://github.com/saurabhsingh1202/plant-disease-model"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}
        >
          <ExternalLink size={15} /> View on GitHub
        </a>
      </div>
    </footer>
  );
}
